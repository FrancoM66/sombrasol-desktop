import { app, ipcMain } from 'electron';
import { join } from 'node:path';
import { resolveConfig } from './config';
import { createMainWindow } from './window';
import { setupWatchdog } from './watchdog';
import { setupAutoUpdater } from './updater';
import { registerAdminExit, unregisterShortcuts } from './shortcuts';
import { offlinePagePath } from './paths';
import { setupPrinting } from './printing';

const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) {
  app.quit();
} else {
  app.whenReady().then(() => {
    const config = resolveConfig(process.env);
    const preloadPath = join(__dirname, '../preload/index.js');
    const offlinePath = offlinePagePath(app.isPackaged, process.resourcesPath, __dirname);

    ipcMain.handle('app:get-version', () => app.getVersion());
    setupPrinting();

    const win = createMainWindow(config.allowedOrigin, preloadPath);
    setupWatchdog(win, config.appUrl, offlinePath);
    registerAdminExit();
    setupAutoUpdater();
  });

  app.on('will-quit', unregisterShortcuts);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
