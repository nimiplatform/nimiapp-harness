import type { CapacitorConfig } from '@capacitor/cli';
import type { NimiRemoteAppConfig } from '@nimiplatform/kit/core/app-session';
import { resolveDevelopmentRealm } from '@nimiplatform/app-tools/development';

export function androidConfiguration(env: Record<string, string | undefined> = process.env) {
  const realm = resolveDevelopmentRealm(undefined, env);
  const debugPackage = 'ai.nimi.apps.harness.dev';
  const appId = env.NIMI_ANDROID_PACKAGE_NAME ?? debugPackage;
  if (!/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/.test(appId)) throw new Error('Use the registered Android package name.');
  const local = realm.name === 'local';
  const clientId = env.NIMI_ANDROID_CLIENT_ID?.trim() ?? (local ? 'ai.nimi.harness.android.dev' : undefined);
  const redirectUri = env.NIMI_ANDROID_REDIRECT_URI?.trim() ?? (local ? appId + ':/oauth/callback' : undefined);
  if (!clientId || !redirectUri) throw new Error('Set NIMI_ANDROID_CLIENT_ID and NIMI_ANDROID_REDIRECT_URI for the registered Harness Android source.');
  const callback = new URL(redirectUri);
  if (callback.username || callback.password || callback.search || callback.hash || callback.href !== redirectUri) {
    throw new Error('Use the exact registered Android callback.');
  }
  const https = callback.protocol === 'https:' && callback.pathname !== '/' && !/^(localhost|.*\.localhost|127\..*|\[::1\])$/.test(callback.hostname);
  const privateDev = realm.name === 'local' && redirectUri === appId + ':/oauth/callback';
  if (!https && !privateDev) throw new Error('The official Android source requires its registered HTTPS App Link.');
  const remote: Omit<NimiRemoteAppConfig, 'fetch'> = {
    appId: 'ai.nimi.harness', clientId, redirectUri,
    realmEnvironmentId: realm.environmentId, realmBaseUrl: realm.apiOrigin, officialWebBaseUrl: realm.webOrigin,
  };
  const capacitor: CapacitorConfig = {
    appId, appName: 'Nimi Harness', webDir: 'dist-mobile', loggingBehavior: 'none',
    server: { androidScheme: 'https' },
    plugins: { NimiAppAccess: { realmBaseUrl: remote.realmBaseUrl, clientId, redirectUri } },
  };
  return { remote, capacitor };
}
