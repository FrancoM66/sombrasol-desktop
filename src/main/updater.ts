import { autoUpdater } from 'electron-updater';

// Feed config comes from electron-builder's generated app-update.yml (publish: github).
// The repo is public so the installed app needs no token to read the feed.

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly

export function setupAutoUpdater(): void {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Register error handler BEFORE triggering any check.
  // Logs and swallows so an offline or bad feed never crashes the kiosk.
  autoUpdater.on('error', (err) => {
    console.error('[updater] check failed', err);
  });

  const runCheck = (): void => {
    // Defense-in-depth: .catch() handles promise rejections that arrive before
    // the 'error' event fires in some electron-updater code paths.
    void autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.error('[updater] check failed (promise)', err);
    });
  };

  runCheck();

  // NOTE: The interval intentionally lives for the entire app lifetime —
  // the kiosk process never exits voluntarily, mirroring watchdog's persistent loaders.
  setInterval(runCheck, UPDATE_CHECK_INTERVAL_MS);
}
