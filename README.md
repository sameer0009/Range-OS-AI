# RangeOS AI

RangeOS AI is a full-spectrum cybersecurity operating platform that fuses offensive security, defensive security, digital forensics, AI assistance, and controlled lab orchestration into one secure and modular environment. 

This repository is a `pnpm` workspace powered by Turbo Repo.

## Repository Structure

- `apps/`: User-facing applications (`desktop-shell`, `web-console`).
- `services/`: Scalable backend microservices (`identity`, `lab`, `policy`, `orchestration`, `ai`, `forensics`, `reporting`, `telemetry`, `api-gateway`).
- `packages/`: Shared internal libraries (`ui-components`, `design-system`, `shared-types`).
- `themes/` & `templates/`: Assets and lab templates for the OS ecosystem.
- `scripts/` & `docs/` & `tests/`: Development utilities, global documentation, and end-to-end testing.

## Getting Started

1. Ensure you have Node.js >= 20.0.0 and `pnpm` >= 8 installed.
2. Clone the repository and run:
   ```bash
   pnpm install
   ```

## Available Scripts

From the root of the monorepo, you can run the following Turborepo commands:

- `pnpm build`: Build all packages and applications.
- `pnpm dev`: Start all development servers.
- `pnpm lint`: Run ESLint across all projects.
- `pnpm test`: Execute all tests.
- `pnpm format`: Format codebase using Prettier.

## Architecture Guidelines

- Follow strict typing; use the base `tsconfig` from `@rangeos/tsconfig`.
- Encapsulate features within localized services.
- Never place business logic at the root level; isolate concerns in `packages/` or `services/`.
