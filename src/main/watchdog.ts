import type { BrowserWindow } from 'electron';
import {
  isOfflineLoadFailure,
  nextRetryDelay,
  type ConnectivityState,
} from './watchdog-logic';

export function setupWatchdog(
  win: BrowserWindow,
  appUrl: string,
  offlinePath: string,
): void {
  const wc = win.webContents;
  let state: ConnectivityState = 'online';
  let attempt = 0;
  let retryTimer: NodeJS.Timeout | null = null;

  const clearRetry = (): void => {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  const scheduleRetry = (): void => {
    clearRetry();
    retryTimer = setTimeout(() => {
      attempt += 1;
      void wc.loadURL(appUrl);
    }, nextRetryDelay(attempt));
  };

  const goOffline = (): void => {
    state = 'offline';
    void win.loadFile(offlinePath);
    scheduleRetry();
  };

  wc.on('did-fail-load', (_event, errorCode, _desc, _url, isMainFrame) => {
    if (!isOfflineLoadFailure(isMainFrame, errorCode)) return;
    goOffline();
  });

  wc.on('did-finish-load', () => {
    if (wc.getURL().startsWith('file://')) {
      wc.send('connectivity', 'offline');
      return;
    }
    state = 'online';
    attempt = 0;
    clearRetry();
    wc.send('connectivity', 'online');
  });

  void wc.loadURL(appUrl);
}
