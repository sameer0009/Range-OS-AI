#!/bin/bash
# RangeOS AI - GUI & Identity Setup Script
# Target: KDE Plasma on Ubuntu Noble

set -e

echo "[*] Initializing Tactical GUI Environment..."

# 1. Install KDE Plasma Core & SDDM
apt install -y \
    kde-plasma-desktop sddm \
    plasma-nm plasma-pa dolphin konsole \
    ark gwenview okular

# 2. Add Tactical Branding Dependencies
apt install -y \
    kvantum qt5-style-kvantum qt6-style-kvantum \
    latte-dock fonts-inter fonts-roboto-mono

# 3. Apply Custom KDE Colors & Glassmorphism (Skeleton)
# Note: Real implementation would copy kdeglobals and theme folders to /usr/share/
echo "[*] Injecting RangeOS AI Custom Theme assets..."

# 4. Configure SDDM for Auto-Login (Optional for Live Environments)
# sed -i 's/User=/User=range-operator/' /etc/sddm.conf

# 5. Cleanup
apt autoremove -y

echo "[+] Tactical GUI Environment Configured."
