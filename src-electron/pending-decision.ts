import { createHash } from 'node:crypto';
import { LiveDoc, ROOT_CONVERSATION_ID, ToolTask, type EntryId, type Tx } from '@earendil-works/pi-durable';
import { isJsonObject } from '@nimiplatform/sdk/types';
import { textPreview } from './text-preview.js';

export type DecisionDiffPreview = {
  kind: 'write' | 'edit' | 'command';
  path?: string;
  content?: string;
  command?: string;
  replacements?: { oldText: string; newText: string }[];
};

type Review = {
  state: 'review';
  taskId: number;
  revision: string;
  tool: string;
  title?: string;
  summary?: string;
  argumentsJson: string;
  diffPreview?: DecisionDiffPreview;
};
export type PendingDecision = { state: 'none' } | { state: 'open-on-pc'; tool: string } | Review;

function buildDecisionMetadata(tool: string, args: Record<string, unknown>): {
  title: string;
  summary: string;
  diffPreview?: DecisionDiffPreview;
} {
  const path = typeof args.path === 'string' ? args.path : undefined;
  if (tool === 'write' && path && typeof args.content === 'string') {
    return {
      title: `Write ${path}`,
      summary: `Create or replace ${path} (${args.content.length} chars)`,
      diffPreview: { kind: 'write', path, content: textPreview(args.content, 16384).text },
    };
  }
  if (tool === 'edit' && path && Array.isArray(args.edits)) {
    const replacements = args.edits
      .filter((item): item is { oldText: string; newText: string } =>
        isJsonObject(item) && typeof item.oldText === 'string' && typeof item.newText === 'string')
      .slice(0, 20)
      .map(item => ({
        oldText: textPreview(item.oldText, 4096).text,
        newText: textPreview(item.newText, 4096).text,
      }));
    return {
      title: `Edit ${path}`,
      summary: `Apply ${replacements.length} replacement${replacements.length === 1 ? '' : 's'} to ${path}`,
      ...(replacements.length ? { diffPreview: { kind: 'edit' as const, path, replacements } } : {}),
    };
  }
  if ((tool === 'bash' || tool === 'powershell') && typeof args.command === 'string') {
    const firstLine = args.command.trim().split(/\r?\n/)[0] ?? '';
    return {
      title: tool === 'powershell' ? 'Run PowerShell command' : 'Run shell command',
      summary: textPreview(firstLine, 160).text,
      diffPreview: { kind: 'command', command: textPreview(args.command, 8192).text },
    };
  }
  if (tool === 'web_fetch' && typeof args.url === 'string') {
    return { title: 'Fetch web URL', summary: textPreview(args.url, 200).text };
  }
  if ((tool === 'invoke_nimi_integration' || tool === 'read_nimi_integration') && typeof args.operation === 'string') {
    return { title: `Run integration: ${args.operation}`, summary: `Target ${String(args.targetRef ?? '')}` };
  }
  if (tool === 'transcribe_audio' && path) {
    return { title: 'Transcribe audio', summary: path };
  }
  if (tool === 'share_result_file' && typeof args.filename === 'string') {
    return { title: 'Share result file', summary: args.filename };
  }
  return { title: `Allow ${tool}`, summary: tool };
}

// The consumer receives one complete proposal. Larger arguments stay on the PC.
export async function readPendingDecision(tx: Tx, sessionId: string, decisionSignal: string): Promise<PendingDecision> {
  const live = await tx.doc(LiveDoc, ROOT_CONVERSATION_ID);
  for (const slot of live.tools ?? []) {
    if (!slot.taskId || slot.status !== 'sleeping') continue;
    const task = await tx.task(slot.taskId);
    if (!task || task.kind !== ToolTask.definition.name || task.abortRequested || task.state.status !== 'sleeping'
      || !task.state.signals?.some(wait => wait.signal === decisionSignal && wait.key === 'decision')) continue;
    const input = task.input;
    if (!isJsonObject(input) || input.kind !== 'model' || typeof input.assistant !== 'number' || input.callId !== slot.callId) continue;
    const entry = await tx.entry(input.assistant as EntryId);
    const message = entry?.model?.[0];
    const call = message?.role === 'assistant' ? message.content.find(item => item.type === 'toolCall' && item.id === slot.callId) : undefined;
    if (call?.type !== 'toolCall') continue;
    const argumentsJson = JSON.stringify(call.arguments);
    if (Buffer.byteLength(argumentsJson) > 32768) return { state: 'open-on-pc', tool: call.name };
    const revision = createHash('sha256').update(JSON.stringify([sessionId, task.id, call.id, call.name, argumentsJson])).digest('hex');
    const meta = buildDecisionMetadata(call.name, call.arguments as Record<string, unknown>);
    return {
      state: 'review',
      taskId: task.id,
      tool: call.name,
      revision,
      title: meta.title,
      summary: meta.summary,
      argumentsJson,
      ...(meta.diffPreview ? { diffPreview: meta.diffPreview } : {}),
    };
  }
  return { state: 'none' };
}
