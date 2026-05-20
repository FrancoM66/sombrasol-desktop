export type ConnectivityState = 'online' | 'offline';
export type ConnectivityEvent =
  | 'load-succeeded'
  | 'load-failed'
  | 'browser-online'
  | 'browser-offline';

export const ERR_ABORTED = -3;
const BASE_RETRY_MS = 2000;
const MAX_RETRY_MS = 30000;

export function nextConnectivityState(
  current: ConnectivityState,
  event: ConnectivityEvent,
): ConnectivityState {
  switch (event) {
    case 'load-succeeded':
      return 'online';
    case 'load-failed':
    case 'browser-offline':
      return 'offline';
    case 'browser-online':
      return current; // a reload is triggered separately; online is confirmed on load-succeeded
    default:
      return current;
  }
}

export function nextRetryDelay(attempt: number): number {
  if (attempt <= 0) return BASE_RETRY_MS;
  return Math.min(BASE_RETRY_MS * 2 ** attempt, MAX_RETRY_MS);
}

export function isOfflineLoadFailure(isMainFrame: boolean, errorCode: number): boolean {
  return isMainFrame && errorCode !== ERR_ABORTED;
}
