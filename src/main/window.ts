import { BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import { isAllowedNavigation } from './navigation';

const SESSION_PARTITION = 'persist:sombrasol';
const BLOCKED_SHORTCUT_KEYS = new Set(['I', 'J', 'C', 'R', '+', '-', '=']);

export function createMainWindow(allowedOrigin: string, preloadPath: string): BrowserWindow {
  const iconPath = app_isPackaged()
    ? join(process.resourcesPath, 'icon.png')
    : join(__dirname, '../../resources/icon.png');

  const win = new BrowserWindow({
    show: false,
    kiosk: true,
    fullscreen: true,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app_isPackaged(),
      partition: SESSION_PARTITION,
    },
  });

  win.once('ready-to-show', () => win.show());

  win.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedNavigation(url, allowedOrigin)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedNavigation(url, allowedOrigin)) return { action: 'allow' };
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  if (app_isPackaged()) {
    win.webContents.on('before-input-event', (event, input) => {
      const ctrl = input.control || input.meta;
      if (ctrl && BLOCKED_SHORTCUT_KEYS.has(input.key.toUpperCase())) event.preventDefault();
      if (input.key === 'F12') event.preventDefault();
    });
  }

  return win;
}

function app_isPackaged(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('electron').app.isPackaged;
}
