#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RangeOS AI — Branding Asset Pipeline
# Generates all derived assets from master sources.
# Requires: inkscape, optipng, python3
# Usage: bash branding/generate_assets.sh [--version X.Y.Z]
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

VERSION="${VERSION:-0.2.31}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$SCRIPT_DIR/src"
OUT="$SCRIPT_DIR/generated"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
info() { echo -e "${CYAN}[BRAND]${NC} $*"; }
ok()   { echo -e "${GREEN}[  OK ]${NC} $*"; }

echo ""
info "RangeOS AI Branding Pipeline — v${VERSION}"

command -v inkscape &>/dev/null || { echo "inkscape required"; exit 1; }
command -v optipng  &>/dev/null || { echo "optipng required"; exit 1; }

mkdir -p "$OUT"/{icons,plymouth,sddm,calamares,kde,grub}

# ── Step 1: Export icon set from master SVG ──────────────────────────────
info "Exporting icon set from logo.svg..."
for SIZE in 16 32 48 64 128 256 512; do
    inkscape -w "$SIZE" -h "$SIZE" \
        "$SRC/logo.svg" \
        -o "$OUT/icons/rangeos_${SIZE}x${SIZE}.png" \
        2>/dev/null
    optipng -quiet -o2 "$OUT/icons/rangeos_${SIZE}x${SIZE}.png"
done
ok "Icon set exported: 7 sizes"

# ── Step 2: Plymouth splash assets ──────────────────────────────────────
info "Preparing Plymouth assets..."
cp "$SRC/logo.svg" "$OUT/plymouth/"
cp "$SCRIPT_DIR/plymouth/rangeos.plymouth" "$OUT/plymouth/"
cp "$SCRIPT_DIR/plymouth/rangeos.script"   "$OUT/plymouth/"
# Export 256px logo for Plymouth (no SVG support at early boot)
inkscape -w 256 -h 256 "$SRC/logo.svg" -o "$OUT/plymouth/logo.png" 2>/dev/null
ok "Plymouth assets ready"

# ── Step 3: SDDM login theme ────────────────────────────────────────────
info "Preparing SDDM theme..."
cp "$SCRIPT_DIR/sddm/theme.conf"  "$OUT/sddm/"
cp "$SCRIPT_DIR/sddm/sddm.conf"   "$OUT/sddm/"
inkscape -w 128 -h 128 "$SRC/logo-mono.svg" -o "$OUT/sddm/logo.svg.png" 2>/dev/null || \
    cp "$OUT/icons/rangeos_128x128.png" "$OUT/sddm/logo.png"
cp "$SRC/wallpaper-dark-4k.png" "$OUT/sddm/wallpaper.png" 2>/dev/null || true
ok "SDDM theme assets ready"

# ── Step 4: Calamares branding ──────────────────────────────────────────
info "Rendering Calamares branding..."
cp "$SCRIPT_DIR/calamares/branding.desc" "$OUT/calamares/"
# Patch version string into branding.desc
sed -i "s|0.2.31-Alpha|${VERSION}-Alpha|g" "$OUT/calamares/branding.desc"
cp "$OUT/icons/rangeos_256x256.png"       "$OUT/calamares/logo.png"
cp "$SRC/wallpaper-installer.png"         "$OUT/calamares/background.png" 2>/dev/null || \
    cp "$SRC/wallpaper-dark-4k.png"       "$OUT/calamares/background.png"
ok "Calamares branding ready"

# ── Step 5: KDE assets ──────────────────────────────────────────────────
info "Preparing KDE assets..."
cp "$SCRIPT_DIR/kde/kdeglobals" "$OUT/kde/"
sed -i "s|RangeOS-Obsidian|RangeOS-Obsidian-${VERSION}|g" "$OUT/kde/kdeglobals" 2>/dev/null || true
cp "$SRC/wallpaper-dark-4k.png" "$OUT/kde/wallpaper.png" 2>/dev/null || true
ok "KDE assets ready"

# ── Step 6: GRUB splash ─────────────────────────────────────────────────
info "Preparing GRUB splash..."
cp "$SCRIPT_DIR/grub/rangeos-grub.cfg" "$OUT/grub/"
# Export centered logo on #020617 at 1920×1080 for GRUB
inkscape -w 512 -h 512 "$SRC/logo.svg" -o "$OUT/grub/rangeos-splash-logo.png" 2>/dev/null || \
    cp "$OUT/icons/rangeos_512x512.png" "$OUT/grub/rangeos-splash-logo.png"
ok "GRUB assets ready"

# ── Step 7: OS identity files ────────────────────────────────────────────
info "Generating OS identity files..."
cp "$SCRIPT_DIR/os-release" "$OUT/"
sed -i "s|0.2.31|${VERSION}|g" "$OUT/os-release"
cp "$SCRIPT_DIR/motd"       "$OUT/"
sed -i "s|0.2.31-Alpha|${VERSION}-Alpha|g" "$OUT/motd"
ok "OS identity files ready"

echo ""
ok "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ok "  Branding pipeline complete → $OUT"
ok "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
