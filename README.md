![Cognix Core — Connected Intelligence](https://raw.githubusercontent.com/cognixnexus/cognixnexus/main/assets/cognix-core-banner.svg)

<p align="center">
  <strong>A personal knowledge OS for research, connected thinking, and durable recall.</strong><br/>
  Capture information → preserve evidence → connect concepts → retrieve and remember what matters.
</p>

<p align="center">
  <a href="https://cognix-nexus.vercel.app">Live Web App</a>
  &nbsp;·&nbsp;
  <a href="https://cognix-core-ypak.onrender.com">Backend</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/cognixnexus/Cognix-Nexus/issues">Issues</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-111827?style=flat-square&logo=next.js"/>
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi"/>
  <img alt="Expo" src="https://img.shields.io/badge/React_Native-Expo-4630EB?style=flat-square&logo=expo"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase"/>
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary"/>
</p>

---

## Overview

**Cognix Nexus** is an evolving personal knowledge and research intelligence platform within the broader **Cognix Core** vision.

It is designed to turn scattered information into a structured, connected knowledge base. Sources can be captured and processed into claims, evidence, and concepts; reviewed knowledge can then support search, synthesis, graph exploration, and active recall.

> **Core idea:** Don't just save information. Make it understandable, traceable, connected, and reusable.

## Product capabilities

| Capability | Purpose |
|---|---|
| Research ingestion | Bring in research material from web sources, PDFs, audio, books, and capture channels |
| Evidence-first processing | Associate extracted claims with source material and review context |
| Knowledge graph | Explore relationships between concepts, citations, and evidence |
| Hybrid retrieval | Combine vector search and structured context |
| Active recall | Support durable learning with flashcards and spaced repetition |
| Multi-channel capture | Support web, mobile, cloud-drive, and Telegram-oriented workflows |
| Media intelligence | Process audio/video inputs and attach useful context |

Extracted information is not automatically verified knowledge. Source traceability and human review remain important.

## Architecture

```text
  Research & Capture
  Web · PDF · Audio · Books · Mobile · Telegram
                  |
                  v
  Cognix Core Processing
  Extraction · Claims · Entities · Embeddings
                  |
                  v
  Knowledge Store
  PostgreSQL / pgvector · Evidence · Relationships
  Concepts · Review state · Recall data
                  |
                  v
  Cognix Interfaces
  Next.js Web · Expo Mobile · Capture Bot
                  |
                  v
  Search · Synthesis · Graph Exploration · Recall
```

## Technology

| Layer | Technologies |
|---|---|
| Web | Next.js 15, React |
| Backend | Python 3.12, FastAPI |
| Mobile | React Native, Expo |
| Database & retrieval | Supabase, PostgreSQL, pgvector |
| AI integrations | Gemini, Groq |
| Media | Cloudinary |
| Deployment | Vercel, Render |

The stack reflects the current project direction. Refer to source configuration for the authoritative, up-to-date implementation.

## Repository layout

The currently documented application areas include:

- `apps/web-platform/backend` — backend API and processing services
- `apps/web-platform/frontend` — web application

The source tree is the authoritative reference for additional modules and integrations.

## Quick start

### Backend

```bash
cd apps/web-platform/backend
python -m venv .venv
source .venv/bin/activate

# Windows PowerShell:
# .venv\\Scripts\\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

Open a second terminal:

```bash
cd apps/web-platform/frontend
pnpm install
pnpm dev
```

### Environment

Configure the environment variables required by the backend and frontend integrations before starting connected services.

- Keep credentials in local environment files or deployment secret managers.
- Never commit API keys, tokens, or private user data.
- Use example environment files when provided by the project.

## Deployment

- **Web:** [cognix-nexus.vercel.app](https://cognix-nexus.vercel.app)
- **Backend:** [cognix-core-ypak.onrender.com](https://cognix-core-ypak.onrender.com)

Hosted availability and feature coverage can change; check the live services and deployment configuration for current status.

## Development principles

1. **Evidence-first:** preserve source context for extracted knowledge.
2. **Human review:** distinguish generated claims from approved knowledge.
3. **Connected context:** make relationships discoverable.
4. **Useful recall:** make captured knowledge accessible later.
5. **Incremental architecture:** keep application surfaces and integrations maintainable.

## Contributing

Bug reports and focused suggestions are welcome.

1. Check [existing issues](https://github.com/cognixnexus/Cognix-Nexus/issues) before opening a duplicate.
2. Include clear reproduction steps for bugs.
3. Describe expected and actual behavior.
4. Never include secrets, private documents, or personal data in reports.

## License

The project currently states **Private Knowledge OS License — All Rights Reserved**. No permission to redistribute or reuse source code should be inferred beyond the published terms.

---

<p align="center">
  <sub>PART OF THE COGNIX CORE VISION · CONNECTED KNOWLEDGE & PRACTICAL INTELLIGENCE</sub>
</p>
