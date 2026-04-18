# RangeOS AI

![RangeOS AI Hero Banner](banner.png)

## 🌐 The Ultimate Cyber Operations Command Center

**RangeOS AI** is a high-fidelity, next-generation platform designed for end-to-end cyber warfare simulations, forensic investigations, and defensive laboratory management. It provides a unified "Strategic Console" for red-teamers, blue-teamers, and forensic analysts to collaborate within a high-trust, AI-augmented environment.

---

## 🚀 Key Modules

### 📊 Strategic Dashboard (Bento Console)
A high-density mission overview featuring live lab galleries, prioritized alert consoles, and modular widgets for real-time situational awareness.

### 🛠️ Neural Forge (Lab Builder)
An AI-assisted laboratory synthesis engine. Design complex network topologies using natural language prompts or the interactive blueprint browser.

### 🗺️ Topology Command Center
Interactive SVG-based network mapping. Visualize traffic flows between Red, Blue, Target, and Evidence enclaves with integrated node inspection and policy compliance tracking.

### 🤖 AI Assistant Workbench
Collaborate with specialized intelligence personae (Tutor, Architect, Analyst, Writer). Leverage real-time tactical suggestions and context-aware artifact analysis.

### 🔍 Forensics Command Center
A dedicated suite for DFIR (Digital Forensics and Incident Response). Manage investigative timelines, track evidence chain-of-custody, and perform automated hash verification.

### 📄 Reports Repository
Synthesize investigative data into professional mission reports. Version-controlled document management for Pentest, Forensic, and Incident summaries.

---

## 🏗️ Architecture & Technology Stack

RangeOS AI is built on a distributed microservices architecture optimized for security, isolation, and speed.

| Component | Technology |
| :--- | :--- |
| **Frontend** | React (TypeScript), Tailwind CSS, Vite |
| **Backend Services** | FastAPI (Python), SQLModel, PostgreSQL |
| **API Gateway** | Node.js, Express, Pino Logger |
| **Orchestration** | Pluggable Hypervisor Adapter (KVM/Libvirt Ready) |
| **Auth** | JWT (Stateless Identity Management) |
| **Style** | Cyber-Ops Design System (Glassmorphism + CSS Grids) |

### Microservices Ecosystem:
- `identity-service`: Secure session & credential management.
- `lab-service`: Infrastructure-as-Code (IaC) metadata.
- `policy-service`: Deterministic "Deny-Override" trust engine.
- `ai-service`: Intelligence stub with multi-agent support.
- `forensics-service`: Case tracking and evidence integrity vault.
- `reporting-service`: Professional document synthesis.
- `orchestration-service`: Async hardware provisioning tasks.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL
- `pnpm` (Workspace management)

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/sameer0009/Range-OS-AI.git
    cd Range-OS-AI
    ```

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` in each service directory to `.env` and configure your local DB/JWT settings.

4.  **Run Dev Environment**:
    ```bash
    pnpm run dev
    ```

---

## ⚖️ License
Proprietary // RangeOS Tactical Systems.

---
**Build**: 0.2.0-Alpha  
**Kernel**: 6.2.0-range-ai  
**Status**: Intelligence Core Established.
