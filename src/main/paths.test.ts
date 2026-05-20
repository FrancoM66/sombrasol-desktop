import { describe, it, expect } from 'vitest';
import { offlinePagePath } from './paths';

describe('offlinePagePath', () => {
  it('uses resourcesPath when packaged', () => {
    const p = offlinePagePath(true, '/app/resources', '/app/out/main');
    expect(p.replace(/\\/g, '/')).toBe('/app/resources/offline.html');
  });

  it('uses the source resources dir in dev', () => {
    const p = offlinePagePath(false, '/ignored', '/repo/out/main');
    expect(p.replace(/\\/g, '/')).toBe('/repo/resources/offline.html');
  });
});
