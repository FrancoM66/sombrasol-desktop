import { contextBridge, ipcRenderer } from 'electron';

type ConnectivityStatus = 'online' | 'offline';

contextBridge.exposeInMainWorld('sombrasolDesktop', {
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:get-version'),
  onConnectivityChange: (callback: (status: ConnectivityStatus) => void): void => {
    ipcRenderer.on('connectivity', (_event, status: ConnectivityStatus) => callback(status));
  },
  printPass: (html: string): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke('print:pass', html),
});
