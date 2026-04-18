# Changelog

All notable changes to **RangeOS AI** are documented in this file.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.0-Alpha1] — 2026-04-19 "Noble Forge"

> First complete GUI-based Linux OS release of RangeOS AI.  
> Targets: Ubuntu 24.04 Noble Numbat base. KDE Plasma desktop.

### Platform & Build
- 5-phase `build/forge.sh` Noble Forge pipeline: preflight → Electron build → service bundle → assets/system → ISO
- 4 installable `.deb` packages: `rangeos-core`, `rangeos-shell`, `rangeos-assets`, `rangeos-system`
- `build/Dockerfile.forge` Docker build container for reproducible builds on any host OS
- `electron-builder.yml` producing `rangeos-shell_*.deb` + AppImage
- Full `DEBIAN/` control trees with 7-step `postinst` provisioner script

### Branding & Identity
- Primary logo, 4K desktop wallpaper, and SDDM login wallpaper generated
- Plymouth boot splash: centered logo + animated progress bar
- GRUB splash at 1920×1080 with `RangeOS AI` distributor entry
- Custom SDDM QML login theme (dark Obsidian palette)
- Calamares installer `branding.desc` with product strings and slide backgrounds
- `kdeglobals` KDE color scheme (Obsidian dark, `#3b82f6` accent, Kvantum widget style)
- `/etc/os-release`, `/etc/motd` ASCII banner with version
- `branding/generate_assets.sh` 7-step asset pipeline

### First-Boot Onboarding ("Mission Start")
- 8-step `OnboardingWizard.tsx` full-screen overlay
- Steps: Welcome → System Check → Admin Setup → Service Init → Policy Profile → Sample Lab → Theme Preview → Ready
- `useOnboardingStore.ts` — Zustand persisted state, step tracking, system checks, firstBoot flag
- `firstBoot` guard in `App.tsx` with `VITE_SKIP_ONBOARDING=true` CI bypass
- `POST /v1/identity/admin-bootstrap` — one-time-use endpoint with single-use guard

### Settings & Theme Engine ("Control Deck")
- `SettingsStore.ts` — full typed schema, 3 curated themes, instant DOM CSS var application
- 7-panel `SettingsView.tsx`: Appearance, Workspace, Lab Defaults, Service Endpoints (with live ping), Update Manager, Privacy, Keyboard Shortcuts
- Zero-reload theme switching via CSS custom properties

### Notifications & Health ("Pulse")
- `NotificationStore.ts` — 15s health polling, 60s dedup anti-spam, FIFO 50-item cap
- Footer Health Bar in `MainShell.tsx` — 8 real-time service status dots
- `NotificationCenter.tsx` — slide-out panel with bell badge, per-item dismiss, Clear All
- `ToastContainer.tsx` — CRITICAL/HIGH auto-dismiss toasts (5s non-critical)

### Global Search
- `SearchEngine` using SQLite FTS5 for sub-millisecond full-text retrieval
- Mission-scoped indexing — results filtered by active `mission_id`
- `CommandPalette.tsx` integrated with categorized results and preview snippets

### Update Manager ("Sentinel")
- `sentinel.py` — GPG-signed manifest verification + atomic binary update
- BTRFS snapshot-first deployment model with zero-touch rollback on PhC failure

### Test Infrastructure
- `tests/conftest.py` — shared in-memory SQLite fixtures, JWT token factory
- `tests/test_auth.py` — AUTH-01 → 07 (7 P0 cases)
- `tests/test_health.py` — SH-05 parameterized health probes (8 services)
- `tests/test_labs.py` — LAB-01, LAB-02, LAB-07
- `tests/test_forensics.py` — FOR-01 → 06 (6 P0 cases)
- `tests/test_policy.py` — POL-01 → 05 (9 cases with parametrize)
- `tests/test_abuse.py` — Red Gate: 28 adversarial cases across 8 trust boundaries
- `pytest.ini` with custom markers: `integration`, `e2e`, `unit`

### Release Governance
- `release_checklist.md` — 114 items across 12 subsystems; 79 BLOCKING items; 5 sign-off roles

### Known Limitations (Alpha)
- KVM-dependent tests (`@pytest.mark.integration`) require physical Linux host with `/dev/kvm`
- DOCX export (`REP-06`) deferred to v0.3.1
- Live topology refresh polling interval is 30s (target: 5s — v0.3.1)
- SDDM QML theme requires manual testing; no automated pixel-diff yet
- `rangeos-assets` package does not yet bundle Inter font (system must have it installed)

---

## [0.2.x] — 2026-04-18 (Development Milestones)

*Incremental platform development. See git log for commit-level details.*

| Tag | Feature |
|:---|:---|
| 0.2.35 | Red Gate abuse-case validation suite |
| 0.2.34 | P0 pytest test suite (auth, health, labs, forensics, policy) |
| 0.2.33 | First-boot OnboardingWizard (8 steps) |
| 0.2.32 | RangeOS AI branding system |
| 0.2.31 | Noble Forge distro packaging pipeline |
| 0.2.30 | Settings Control Deck (7-panel, 3 themes) |
| 0.2.29 | Pulse health monitoring + NotificationCenter |
| 0.2.28 | Sentinel update manager |
| 0.2.27 | Global search engine (FTS5) |
