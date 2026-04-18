#!/bin/bash
# RangeOS AI - Filesystem Enclave Setup
# Target: Any RangeOS installation

set -e

echo "[*] Initializing RangeOS Tactical Filesystem Layout..."

# 1. Platform Binary and Service Directories
mkdir -p /opt/rangeos/bin
mkdir -p /opt/rangeos/services

# 2. Variable Data and Lab Storage
mkdir -p /var/lib/rangeos/labs
mkdir -p /var/lib/rangeos/evidence
mkdir -p /var/lib/rangeos/reports

# 3. Platform Diagnostics
mkdir -p /var/log/rangeos

# 4. Permissions (The Enclave Model)
# Create system groups if they don't exist
groupadd -f rangeos
groupadd -f forensics
groupadd -f libvirt

# Set directory ownership and sticky bits
chown -R root:rangeos /opt/rangeos
chmod -R 750 /opt/rangeos

chown -R root:rangeos /var/log/rangeos
chmod -R 750 /var/log/rangeos

# High-Security Evidence Enclave
chown -R root:forensics /var/lib/rangeos/evidence
chmod -R 700 /var/lib/rangeos/evidence

# Hypervisor Lab Enclave
chown -R root:libvirt /var/lib/rangeos/labs
chmod -R 770 /var/lib/rangeos/labs

echo "[+] Filesystem Enclaves established successfully."
