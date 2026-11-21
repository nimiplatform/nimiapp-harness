import { createWebNimiAppSession, type NimiRemoteAppConfig } from '@nimiplatform/kit/auth/app/web';
import { mountRemoteSessions } from '../src/remote/mount';

declare const __NIMI_APP_WEB_CONFIG__: NimiRemoteAppConfig;
const dispose = mountRemoteSessions(createWebNimiAppSession(__NIMI_APP_WEB_CONFIG__));
if (import.meta.hot) import.meta.hot.dispose(dispose);
