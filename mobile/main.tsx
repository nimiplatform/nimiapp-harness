import { createMobileNimiAppSession } from '@nimiplatform/kit/auth/app/mobile';
import type { NimiRemoteAppConfig } from '@nimiplatform/kit/core/app-session';
import { mountRemoteSessions } from '../src/remote/mount';

declare const __NIMI_APP_ANDROID_CONFIG__: Omit<NimiRemoteAppConfig, 'fetch'>;
const dispose = mountRemoteSessions(createMobileNimiAppSession(__NIMI_APP_ANDROID_CONFIG__));
if (import.meta.hot) import.meta.hot.dispose(dispose);
