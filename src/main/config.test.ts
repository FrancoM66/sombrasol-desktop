import { describe, it, expect } from 'vitest';
import { resolveConfig, DEFAULT_APP_URL } from './config';

describe('resolveConfig', () => {
  it('defaults to production when env is empty', () => {
    const cfg = resolveConfig({});
    expect(cfg.appUrl).toBe(DEFAULT_APP_URL);
    expect(cfg.allowedOrigin).toBe(DEFAULT_APP_URL);
  });

  it('uses SOMBRASOL_APP_URL override when set', () => {
    const cfg = resolveConfig({ SOMBRASOL_APP_URL: 'https://staging.sombrasol.tech' });
    expect(cfg.appUrl).toBe('https://staging.sombrasol.tech');
    expect(cfg.allowedOrigin).toBe('https://staging.sombrasol.tech');
  });

  it('trims whitespace and ignores blank overrides', () => {
    const cfg = resolveConfig({ SOMBRASOL_APP_URL: '   ' });
    expect(cfg.appUrl).toBe(DEFAULT_APP_URL);
  });
});
