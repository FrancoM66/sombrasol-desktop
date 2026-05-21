# Sombrasol Guard Desktop

Windows kiosk shell that loads the Sombrasol web app full-screen for gatehouse guards.
Fails gracefully offline and auto-updates. See
`docs/superpowers/specs/2026-05-20-guard-desktop-electron-design.md` (in the API repo)
for the design.

## Develop
```bash
npm install
npm run dev        # launches the shell against production
npm test           # unit tests (pure logic)
npm run typecheck
```

Override the target site for staging:
```bash
SOMBRASOL_APP_URL=https://staging.sombrasol.tech npm run dev
```

## Build the Windows installer
```bash
npm run build:win  # outputs dist/Sombrasol-Guard-Setup.exe
```

> **Windows note:** electron-builder extracts a signing toolchain that contains
> symlinks. If the build fails with `Cannot create symbolic link : A required
> privilege is not held by the client`, enable **Developer Mode** (Settings →
> Privacy & security → For developers) or run the build from an elevated terminal.

## Releasing & auto-update

Both the human download link and the silent auto-update feed come from the **same source**:
the public GitHub Releases of `FrancoM66/sombrasol-desktop`.

The stable download URL is:
`https://github.com/FrancoM66/sombrasol-desktop/releases/latest/download/Sombrasol-Guard-Setup.exe`

### Primary path — tag-triggered CI (recommended)

The `Release` GitHub Actions workflow (`.github/workflows/release.yml`) builds on
`windows-latest` and publishes a non-draft GitHub release automatically when you push a `v*` tag.

1. Bump `version` in `package.json` (e.g. to `0.2.0`). The tag **must** match this value —
   electron-updater compares the running app's baked-in version against `latest.yml` in the feed.
   CI does **not** auto-bump.
2. Commit the version bump, then push a matching tag:
   ```bash
   git tag v0.2.0 && git push origin v0.2.0
   ```
3. The workflow runs: `npm ci` → `npm run build` → `electron-builder --win --publish always`.
   It produces a non-draft GitHub release containing the installer, `latest.yml`, and `.blockmap`.
4. The constant asset name keeps `releases/latest/download/Sombrasol-Guard-Setup.exe` resolving.
   Installed apps pick up the update on their next startup check or the hourly background check.

### Fallback — manual local release

If you need to publish from a local machine without CI:
1. Bump `version` in `package.json`.
2. `npm run build:win` → produces `dist/Sombrasol-Guard-Setup.exe`.
3. Create a GitHub release and attach the installer:
   ```bash
   gh release create vX.Y.Z "dist/Sombrasol-Guard-Setup.exe" \
     --title "Sombrasol Guard vX.Y.Z" --notes "<release notes>"
   ```
   Because the asset name is constant, the `releases/latest/download/...` link always
   resolves to this newest upload.

## Not in v1
Local DB / offline data, social login, macOS/Linux, printing, code signing.
