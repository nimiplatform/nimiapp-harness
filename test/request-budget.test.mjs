import assert from 'node:assert/strict';
import test from 'node:test';
import { BACKGROUND_CONTEXT as context } from '@earendil-works/chord/context';
import { createModels } from '@earendil-works/pi-ai/models';
import { fauxAssistantMessage, fauxProvider } from '@earendil-works/pi-ai/providers/faux';
import { AssistantEntry, createRegistry, defineExtension, GenerationTask, Harness, hook, MemoryStorage, UserEntry } from '@earendil-works/pi-durable';
import { needsCompaction } from '../dist-electron/request-budget.js';

test('short turns compact within durable before the Nimi message limit', async () => {
  const faux = fauxProvider();
  const models = createModels();
  models.setProvider(faux.provider);
  const registry = createRegistry();
  registry.install(defineExtension({
    name: 'budget',
    hooks: [hook(GenerationTask, {
      beforeRequest: ({ messages }) => needsCompaction(messages) ? { messages, compact: true } : undefined,
    })],
  }));
  let summaryCalls = 0;
  faux.setResponses([
    async transcript => {
      summaryCalls++;
      assert.equal(transcript.messages.length, 2);
      assert.ok(JSON.stringify(transcript).length < 1024 * 1024);
      return fauxAssistantMessage('Earlier exchanges retained. User goal remains the same.');
    },
    async transcript => {
      assert.ok(transcript.messages.length < 96);
      assert.ok(JSON.stringify(transcript).includes('Earlier exchanges retained.'));
      return fauxAssistantMessage('Continued.');
    },
  ]);
  const harness = await Harness.open(new MemoryStorage(), {
    models, registry, settings: { compaction: { keepRecentTokens: 0 } },
  }, context);
  try {
    const root = await harness.root(context, { agent: { model: { provider: 'faux', modelId: 'faux-1' } } });
    await root.commit(async tx => {
      for (let index = 0; index < 70; index++) {
        await tx.appendEntry(UserEntry, root.id, { model: [{ role: 'user', content: 'hi', timestamp: 0 }] });
        await tx.appendEntry(AssistantEntry, root.id, { model: [fauxAssistantMessage('ok')] });
      }
    }, context);
    const submitted = await root.submit({ type: 'input', content: 'Continue the task.' }, context);
    const settled = await submitted.wait(context);
    assert.equal(settled.status, 'done', JSON.stringify(settled));
    assert.equal(summaryCalls, 1);
  } finally {
    await harness.close(context);
  }
});

test('request byte budgeting counts text while images use Artifact references', () => {
  assert.equal(needsCompaction([{ role: 'user', content: 'x'.repeat(260 * 1024), timestamp: 0 }]), true);
  assert.equal(needsCompaction([{ role: 'user', content: [{ type: 'image', data: 'x'.repeat(2 * 1024 * 1024), mimeType: 'image/png' }], timestamp: 0 }]), false);
});
