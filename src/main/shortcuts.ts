import { app, globalShortcut } from 'electron';

const ADMIN_EXIT_ACCELERATOR = 'CommandOrControl+Shift+Q';

export function registerAdminExit(): void {
  globalShortcut.register(ADMIN_EXIT_ACCELERATOR, () => app.quit());
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll();
}
