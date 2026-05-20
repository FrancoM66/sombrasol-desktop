import { autoUpdater } from 'electron-updater';

export function setupAutoUpdater(): void {
  // Feed config comes from electron-builder's generated app-update.yml (publish: generic).
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  void autoUpdater.checkForUpdatesAndNotify();
}
