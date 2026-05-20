import { join } from 'node:path';

export function offlinePagePath(
  isPackaged: boolean,
  resourcesPath: string,
  mainDir: string,
): string {
  return isPackaged
    ? join(resourcesPath, 'offline.html')
    : join(mainDir, '..', '..', 'resources', 'offline.html');
}
