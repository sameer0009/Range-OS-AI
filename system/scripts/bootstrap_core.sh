#!/bin/bash
# RangeOS AI - Core OS Bootstrap Script
# Target: Ubuntu 24.04 LTS (Noble Numbat)

set -e

echo "[*] Initializing RangeOS AI Core Bootstrap..."

# 1. Update & Base Repos
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y

# 2. System Foundation
apt install -y \
    sudo curl wget gnupg2 ca-certificates \
    build-essential git \
    bridge-utils iproute2 nftables \
    python3-pip python3-venv \
    postgresql postgresql-contrib redis-server

# 3. Virtualization & Containerization Stack
apt install -y \
    qemu-kvm libvirt-daemon-system libvirt-clients \
    virt-manager ovmf dnsmasq-base

# 4. Networking Support
apt install -y \
    openvpn wireguard nmap tcpdump wireshark-common

# 5. Runtime Environments (Node.js & PNPM)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pnpm

# 6. User and Group Management
groupadd -f libvirt
usermod -aG libvirt $USER
usermod -aG libvirt-qemu $USER

echo "[+] Core Foundation Bootstrap Complete."
