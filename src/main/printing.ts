import { BrowserWindow, ipcMain } from 'electron';
import { htmlToDataUrl } from './print-logic';

const PRINT_TIMEOUT_MS = 15000;

let printInFlight = false;

export interface PrintResult {
  ok: boolean;
  error?: string;
}

export function setupPrinting(): void {
  ipcMain.handle('print:pass', (_event, html: string): Promise<PrintResult> => {
    if (printInFlight) {
      return Promise.resolve({ ok: false, error: 'Print already in progress' });
    }
    printInFlight = true;
    return printHtml(html);
  });
}

function printHtml(html: string): Promise<PrintResult> {
  return new Promise((resolve) => {
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    let settled = false;
    let timeout: NodeJS.Timeout;
    const finish = (result: PrintResult): void => {
      if (settled) return;
      settled = true;
      printInFlight = false;
      clearTimeout(timeout);
      if (!win.isDestroyed()) win.close();
      resolve(result);
    };

    timeout = setTimeout(() => {
      finish({ ok: false, error: 'Print timed out' });
    }, PRINT_TIMEOUT_MS);

    win.webContents.once('did-fail-load', (_e, _code, desc) => {
      finish({ ok: false, error: desc || 'Failed to load pass' });
    });

    win.webContents.once('did-finish-load', () => {
      try {
        win.webContents.print({ silent: true, printBackground: true }, (success, failureReason) => {
          if (success) {
            finish({ ok: true });
            return;
          }
          // No default printer or print failure: fall back to the system dialog
          // so the guard can still print and is never stranded.
          try {
            win.webContents.print({ silent: false, printBackground: true }, (dialogOk, dialogReason) => {
              finish(
                dialogOk
                  ? { ok: true }
                  : { ok: false, error: failureReason || dialogReason || 'Printing failed' },
              );
            });
          } catch (err) {
            finish({ ok: false, error: err instanceof Error ? err.message : 'Printing failed' });
          }
        });
      } catch (err) {
        finish({ ok: false, error: err instanceof Error ? err.message : 'Printing failed' });
      }
    });

    void win.loadURL(htmlToDataUrl(html));
  });
}
