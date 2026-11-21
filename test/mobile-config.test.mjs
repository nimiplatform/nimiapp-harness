import test from 'node:test';
import assert from 'node:assert/strict';
import { androidConfiguration } from '../mobile-config.ts';

test('official Android source uses the same registered App Link and client in the renderer and native plugin', () => {
  const client = { NIMI_ANDROID_CLIENT_ID: 'test-harness', NIMI_ANDROID_REDIRECT_URI: 'https://harness.example.test/auth/return' };
  const { remote, capacitor } = androidConfiguration(client);
  assert.equal(remote.appId, 'ai.nimi.harness');
  assert.equal(remote.clientId, client.NIMI_ANDROID_CLIENT_ID);
  assert.equal(remote.redirectUri, client.NIMI_ANDROID_REDIRECT_URI);
  assert.deepEqual(capacitor.plugins.NimiAppAccess, { realmBaseUrl: remote.realmBaseUrl, clientId: remote.clientId, redirectUri: remote.redirectUri });
  assert.equal(androidConfiguration({ ...client, NIMI_ANDROID_PACKAGE_NAME: 'org.example.harness' }).capacitor.appId, 'org.example.harness');
  assert.throws(() => androidConfiguration({ ...client, NIMI_ANDROID_PACKAGE_NAME: 'bad/package' }), /registered Android package/);
  assert.throws(() => androidConfiguration({}), /registered Harness Android source/);
  for (const callback of ['http://harness.example.test/return', 'https://localhost/return', 'ai.nimi.apps.harness.dev:/oauth/callback']) {
    assert.throws(() => androidConfiguration({ ...client, NIMI_ANDROID_REDIRECT_URI: callback }), /registered HTTPS App Link/);
  }
  assert.equal(androidConfiguration({ ...client, NIMI_DEV_REALM: 'local', NIMI_ANDROID_REDIRECT_URI: 'ai.nimi.apps.harness.dev:/oauth/callback' }).remote.redirectUri,
    'ai.nimi.apps.harness.dev:/oauth/callback');
});

test('explicit local development uses the Harness Android identity and local coordination', () => {
  const { remote, capacitor } = androidConfiguration({ NIMI_DEV_REALM: 'local' });
  assert.equal(remote.appId, 'ai.nimi.harness');
  assert.equal(capacitor.appId, 'ai.nimi.apps.harness.dev');
  assert.equal(remote.clientId, 'ai.nimi.harness.android.dev');
  assert.equal(remote.redirectUri, capacitor.appId + ':/oauth/callback');
  assert.equal(remote.realmBaseUrl, 'http://127.0.0.1:3002');
  assert.equal(remote.officialWebBaseUrl, 'http://localhost:3000');
  assert.equal(capacitor.plugins.NimiAppAccess.clientId, remote.clientId);
});
