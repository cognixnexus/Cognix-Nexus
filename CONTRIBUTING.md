# Contributing to Cognix Nexus

Thank you for taking the time to help improve Cognix Nexus.

Cognix Nexus is currently a proprietary project. The repository is public for visibility and collaboration context; public availability does not grant permission to copy, redistribute, sublicense, or commercially use the source. Before investing in a substantial code contribution, open an issue and obtain maintainer approval. Any accepted contribution must be covered by a separate written agreement or permission from the project owner.

## Before you start

1. Read the [README](README.md) and [Security Policy](SECURITY.md).
2. Search existing issues before opening a new one.
3. For substantial changes, open an issue first to agree on scope and approach.
4. Never include credentials, private documents, real user data, or production identifiers in issues, commits, logs, or screenshots.

## Local development

The repository contains separate application surfaces:

- Backend: `apps/web-platform/backend`
- Web: `apps/web-platform/frontend`
- Mobile: `apps/mobile`
- Cloudflare embeddings worker: `apps/web-platform/cloudflare/embeddings-worker`

Use the README in the relevant application directory for setup instructions. Copy the relevant `.env.example` file and supply your own local development values. Never commit local environment files.

## Change expectations

- Keep changes focused and explain the user or engineering problem they solve.
- Preserve source attribution and human review boundaries for AI-generated knowledge.
- Enforce authentication and owner-scoped access for user data.
- Validate untrusted input and keep provider credentials server-side.
- Prefer explicit failures over silent fallback for durable data or provider operations.
- Add or update tests for behavior changes.
- Update documentation and example configuration when interfaces or setup requirements change.

## Pull requests

A pull request should include:

- A concise explanation of the change and its motivation.
- Linked issue or prior maintainer approval.
- Tests run and their results.
- Migration, configuration, deployment, and rollback notes when relevant.
- Screenshots for user-facing changes, with private data redacted.

The pull request template includes a security, privacy, validation, and UX checklist. Complete the relevant items honestly. Do not claim tests passed unless they were actually run.

## Security reports

Do not disclose vulnerabilities in public issues. Follow the private reporting instructions in [SECURITY.md](SECURITY.md). Never test destructive operations against production data.

## License and permissions

The project currently states **Private Knowledge OS License — All Rights Reserved**. A public repository is not an open-source license. Do not assume that submitting a patch grants reuse rights or that repository contents may be redistributed.
