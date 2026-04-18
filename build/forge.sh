#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# RangeOS AI — Noble Forge Build Pipeline
# Produces: rangeos-ai-<version>-amd64.iso
# Target Base: Ubuntu 24.04 LTS (Noble Numbat)
# Usage: sudo ./build/forge.sh [--skip-iso] [--version X.Y.Z]
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

# ── Configuration ──────────────────────────────────────────────────────────
VERSION="${VERSION:-0.2.31}"
CODENAME="noble"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$REPO_ROOT/build"
DIST_DIR="$BUILD_DIR/dist"
CHROOT_DIR="$BUILD_DIR/chroot"
ISO_NAME="rangeos-ai-${VERSION}-amd64.iso"
SKIP_ISO=false

# Parse optional flags
for arg in "$@"; do
    case $arg in
        --skip-iso)    SKIP_ISO=true ;;
        --version=*)   VERSION="${arg#*=}" ;;
    esac
done

# ── Colours ──────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
info()  { echo -e "${CYAN}[FORGE]${NC} $*"; }
ok()    { echo -e "${GREEN}[  OK ]${NC} $*"; }
warn()  { echo -e "${YELLOW}[ WARN]${NC} $*"; }
fatal() { echo -e "${RED}[FATAL]${NC} $*"; exit 1; }

echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  RangeOS AI — Noble Forge  |  Version: ${VERSION}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# PHASE 1 — Preflight Checks
# ═══════════════════════════════════════════════════════════════
info "PHASE 1 — Preflight Checks"

[[ "$(id -u)" -eq 0 ]] || fatal "Forge must run as root. Use: sudo ./build/forge.sh"
[[ "$(lsb_release -cs 2>/dev/null)" == "$CODENAME" ]] || \
    warn "Build host is not $CODENAME — results may vary."

REQUIRED_TOOLS=(dpkg-deb pnpm python3.12 debootstrap squashfs-tools xorriso)
for tool in "${REQUIRED_TOOLS[@]}"; do
    command -v "$tool" &>/dev/null || fatal "Missing required tool: $tool"
done

mkdir -p "$DIST_DIR"
ok "Preflight checks passed."

# ═══════════════════════════════════════════════════════════════
# PHASE 2 — Electron Shell Build
# ═══════════════════════════════════════════════════════════════
info "PHASE 2 — Building Electron Shell (rangeos-shell.deb)..."

cd "$REPO_ROOT/apps/desktop-shell"
pnpm install --frozen-lockfile --silent
pnpm build --silent
npx electron-builder --linux deb --publish never

SHELL_DEB=$(find "$REPO_ROOT/apps/desktop-shell/dist/packages" -name "*.deb" | head -1)
[[ -f "$SHELL_DEB" ]] || fatal "electron-builder did not produce a .deb"
cp "$SHELL_DEB" "$DIST_DIR/rangeos-shell_${VERSION}_amd64.deb"
ok "Shell package: rangeos-shell_${VERSION}_amd64.deb"

# ═══════════════════════════════════════════════════════════════
# PHASE 3 — Backend Service Bundle
# ═══════════════════════════════════════════════════════════════
info "PHASE 3 — Packaging backend services (rangeos-core.deb)..."

CORE_STAGE="$BUILD_DIR/staging/rangeos-core"
mkdir -p "$CORE_STAGE/opt/rangeos/services"
mkdir -p "$CORE_STAGE/opt/rangeos/scripts"
mkdir -p "$CORE_STAGE/opt/rangeos/system"

# Copy all backend services
for SVC in "$REPO_ROOT"/services/*/; do
    SVC_NAME=$(basename "$SVC")
    info "  Staging: $SVC_NAME"
    cp -r "$SVC" "$CORE_STAGE/opt/rangeos/services/$SVC_NAME"
done

# Copy scripts and systemd units
cp -r "$REPO_ROOT/system/scripts/"* "$CORE_STAGE/opt/rangeos/scripts/"
cp -r "$REPO_ROOT/system/"   "$CORE_STAGE/opt/rangeos/system/"
cp -r "$BUILD_DIR/packages/rangeos-core/DEBIAN" "$CORE_STAGE/DEBIAN"
chmod 755 "$CORE_STAGE/DEBIAN/postinst"

dpkg-deb --build --root-owner-group "$CORE_STAGE" "$DIST_DIR/rangeos-core_${VERSION}_amd64.deb"
ok "Core package: rangeos-core_${VERSION}_amd64.deb"

# ═══════════════════════════════════════════════════════════════
# PHASE 4 — Assets & System Packages
# ═══════════════════════════════════════════════════════════════
info "PHASE 4 — Building assets and system packages..."

# rangeos-assets
ASSETS_STAGE="$BUILD_DIR/staging/rangeos-assets"
mkdir -p "$ASSETS_STAGE/usr/share/sddm/themes"
mkdir -p "$ASSETS_STAGE/usr/share/color-schemes"
cp -r "$BUILD_DIR/packages/rangeos-assets/DEBIAN" "$ASSETS_STAGE/DEBIAN"
dpkg-deb --build --root-owner-group "$ASSETS_STAGE" "$DIST_DIR/rangeos-assets_${VERSION}_all.deb"
ok "Assets package: rangeos-assets_${VERSION}_all.deb"

# rangeos-system
SYS_STAGE="$BUILD_DIR/staging/rangeos-system"
mkdir -p "$SYS_STAGE/usr/lib/systemd/system"
cp "$REPO_ROOT/system/systemd/"*.service "$SYS_STAGE/usr/lib/systemd/system/" 2>/dev/null || true
cp "$REPO_ROOT/system/systemd/"*.target  "$SYS_STAGE/usr/lib/systemd/system/" 2>/dev/null || true
cp -r "$BUILD_DIR/packages/rangeos-system/DEBIAN" "$SYS_STAGE/DEBIAN"
dpkg-deb --build --root-owner-group "$SYS_STAGE" "$DIST_DIR/rangeos-system_${VERSION}_all.deb"
ok "System package: rangeos-system_${VERSION}_all.deb"

# ═══════════════════════════════════════════════════════════════
# PHASE 5 — ISO Composition (Noble Forge)
# ═══════════════════════════════════════════════════════════════
if $SKIP_ISO; then
    warn "Skipping ISO composition (--skip-iso flag set)."
    echo ""
    echo -e "${GREEN}${BOLD}✔ Noble Forge Complete — Packages built in ${DIST_DIR}/${NC}"
    exit 0
fi

info "PHASE 5 — ISO Composition..."

# 5.1 Bootstrap Noble base rootfs
rm -rf "$CHROOT_DIR"
debootstrap --arch=amd64 "$CODENAME" "$CHROOT_DIR" http://archive.ubuntu.com/ubuntu

# 5.2 Configure chroot environment
cp /etc/resolv.conf "$CHROOT_DIR/etc/resolv.conf"
mount --bind /proc    "$CHROOT_DIR/proc"
mount --bind /sys     "$CHROOT_DIR/sys"
mount --bind /dev     "$CHROOT_DIR/dev"
mount --bind /dev/pts "$CHROOT_DIR/dev/pts"

# Copy our packages into chroot
cp "$DIST_DIR/"*.deb "$CHROOT_DIR/tmp/"

# 5.3 Install platform inside chroot
chroot "$CHROOT_DIR" /bin/bash -c "
    export DEBIAN_FRONTEND=noninteractive
    apt update -qq
    apt install -y --no-install-recommends ubuntu-minimal apt-utils sudo systemd
    dpkg -i /tmp/rangeos-system_${VERSION}_all.deb || apt install -f -y
    dpkg -i /tmp/rangeos-assets_${VERSION}_all.deb || apt install -f -y
    dpkg -i /tmp/rangeos-core_${VERSION}_amd64.deb || apt install -f -y
    dpkg -i /tmp/rangeos-shell_${VERSION}_amd64.deb || apt install -f -y
    rm /tmp/*.deb
    apt autoremove -y && apt clean
"

# 5.4 Unmount chroot binds
umount -lf "$CHROOT_DIR/dev/pts" 2>/dev/null || true
umount -lf "$CHROOT_DIR/dev"     2>/dev/null || true
umount -lf "$CHROOT_DIR/proc"    2>/dev/null || true
umount -lf "$CHROOT_DIR/sys"     2>/dev/null || true

# 5.5 Compress filesystem
info "  Compressing filesystem (squashfs)..."
mkdir -p "$BUILD_DIR/iso-staging/live"
mksquashfs "$CHROOT_DIR" "$BUILD_DIR/iso-staging/live/filesystem.squashfs" \
    -comp xz -e boot -wildcards -noappend -quiet

# 5.6 Copy kernel and initrd from chroot
cp "$CHROOT_DIR/boot/vmlinuz"    "$BUILD_DIR/iso-staging/live/"     2>/dev/null || true
cp "$CHROOT_DIR/boot/initrd.img" "$BUILD_DIR/iso-staging/live/"     2>/dev/null || true

# 5.7 Write ISO
info "  Writing ISO image: $ISO_NAME"
xorriso -as mkisofs \
    -iso-level 3 \
    -volid "RANGEOS_AI_${VERSION}" \
    -full-iso9660-filenames \
    -eltorito-boot boot/grub/bios.img \
    -no-emul-boot -boot-load-size 4 -boot-info-table \
    -output "$DIST_DIR/$ISO_NAME" \
    "$BUILD_DIR/iso-staging"

ok "ISO image: $DIST_DIR/$ISO_NAME"
SHA=$(sha256sum "$DIST_DIR/$ISO_NAME" | cut -d ' ' -f 1)
echo "$SHA  $ISO_NAME" > "$DIST_DIR/${ISO_NAME}.sha256"
ok "SHA256: $SHA"

echo ""
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ✔ Noble Forge Complete — RangeOS AI v${VERSION}"
echo -e "  📦 Packages + ISO: ${DIST_DIR}/"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
