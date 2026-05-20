import { app, BrowserWindow } from 'electron';

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1024, height: 768 });
  void win.loadURL('https://www.sombrasol.tech');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
