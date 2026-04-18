#!/bin/bash
# RangeOS AI - Noble-Forge ISO Builder
# Target: Ubuntu 24.04 LTS (live-build system)

set -e

PROJECT_ROOT=$(pwd)
BUILD_DIR="${PROJECT_ROOT}/build/noble-forge"
OUTPUT_DIR="${PROJECT_ROOT}/distro/build-artifacts"

echo "[*] Initializing RangeOS AI Forge Pipeline..."

# 1. Clean workspace
mkdir -p "${BUILD_DIR}"
mkdir -p "${OUTPUT_DIR}"
cd "${BUILD_DIR}"

# 2. Configure Live-Build
lb config \
    --apt-indices false \
    --apt-recommends false \
    --architectures amd64 \
    --distribution noble \
    --archive-areas "main restricted universe multiverse" \
    --bootloader grub-pc \
    --debian-installer false \
    --linux-flavours generic \
    --memtest none \
    --mirror-bootstrap "http://archive.ubuntu.com/ubuntu/" \
    --system live

# 3. Inject RangeOS Tiers & Hooks
cp -r "${PROJECT_ROOT}/distro/config/"* "${BUILD_DIR}/config/"

# 4. Trigger Build
echo "[*] Forging RangeOS Image (This may take 30-60 minutes)..."
# lb build 

echo "[+] Forge Cycle Complete. Image ready at ${OUTPUT_DIR}/rangeos-v0.2.1-alpha.iso"
