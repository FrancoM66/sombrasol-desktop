import { describe, it, expect } from 'vitest';
import {
  nextConnectivityState,
  nextRetryDelay,
  isOfflineLoadFailure,
  ERR_ABORTED,
} from './watchdog-logic';

describe('nextConnectivityState', () => {
  it('goes offline on a load failure', () => {
    expect(nextConnectivityState('online', 'load-failed')).toBe('offline');
  });

  it('goes offline when the OS reports offline', () => {
    expect(nextConnectivityState('online', 'browser-offline')).toBe('offline');
  });

  it('confirms online only on a successful load', () => {
    expect(nextConnectivityState('offline', 'load-succeeded')).toBe('online');
  });

  it('does not flip to online merely because the OS reports online', () => {
    expect(nextConnectivityState('offline', 'browser-online')).toBe('offline');
  });
});

describe('nextRetryDelay', () => {
  it('uses the base delay for the first attempt', () => {
    expect(nextRetryDelay(0)).toBe(2000);
  });

  it('backs off exponentially', () => {
    expect(nextRetryDelay(2)).toBe(8000);
  });

  it('caps at the maximum delay', () => {
    expect(nextRetryDelay(10)).toBe(30000);
  });
});

describe('isOfflineLoadFailure', () => {
  it('treats a main-frame failure as offline', () => {
    expect(isOfflineLoadFailure(true, -106)).toBe(true);
  });

  it('ignores sub-frame failures', () => {
    expect(isOfflineLoadFailure(false, -106)).toBe(false);
  });

  it('ignores aborted navigations', () => {
    expect(isOfflineLoadFailure(true, ERR_ABORTED)).toBe(false);
  });
});
