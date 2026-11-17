# Cognix Nexus

<p align="center">
  <strong>A personal knowledge OS for research, connected thinking, and durable recall.</strong><br/>
  Capture information → preserve evidence → connect concepts → retrieve and remember what matters.
</p>

<p align="center">
  <a href="https://cognix-nexus.vercel.app">Web App</a>
  ·
  <a href="https://cognix-core-ypak.onrender.com">Backend</a>
  ·
  <a href="https://github.com/cognixnexus/Cognix-Nexus/issues">Issues</a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img alt="Expo" src="https://img.shields.io/badge/React_Native-Expo-000020?style=for-the-badge&logo=expo&logoColor=white"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white"/>
</p>

---

## Overview

**Cognix Nexus** is an evolving personal knowledge and research intelligence platform, developed around the broader **Cognix Core** vision.

It is designed to help turn scattered information into a structured, connected knowledge base. Sources can be captured and processed into claims, evidence, and concepts; reviewed knowledge can then support search, synthesis, graph exploration, and active recall.

The guiding idea is simple: **don't just save information — make it understandable, traceable, connected, and reusable.**

## Core capabilities

| Area | What it does |
|---|---|
| Research ingestion | Bring in research material from web sources, PDFs, audio, books, and capture channels |
| Evidence-first processing | Extract claims and associate them with source material for review |
| Knowledge graph | Explore relationships between concepts, citations, and evidence |
| Hybrid retrieval | Combine vector search and structured context to find relevant knowledge |
| Active recall | Use flashcards and an SM-2-based spaced-repetition workflow |
| Multi-channel capture | Support web, mobile, cloud-drive, and Telegram-oriented capture flows |
| Media intelligence | Process audio/video inputs and attach useful context and concept tags |

> Extracted information is not automatically equivalent to verified knowledge. Review and source traceability are central to the intended workflow.

## Architecture at a glance

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

## Technology stack

| Layer | Technologies |
|---|---|
| Web application | Next.js 15, React |
| Backend API | Python 3.12, FastAPI |
| Mobile | React Native, Expo |
| Database & retrieval | Supabase, PostgreSQL, pgvector |
| AI integrations | Gemini, Groq |
| Media assets | Cloudinary |
| Deployment | Vercel, Render |

The stack reflects the current project direction; integrations and deployment details may change as the codebase evolves.

## Repository layout

The project is organized as a multi-surface application. The main application areas include:

- `apps/web-platform/backend` — backend API and processing services
- `apps/web-platform/frontend` — web application

Other modules and integration paths may be added or reorganized as development continues. The source tree is the authoritative reference.

## Quick start

### 1. Backend

```bash
cd apps/web-platform/backend

python -m venv .venv
source .venv/bin/activate

# Windows PowerShell:
# .venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

Open a second terminal:

```bash
cd apps/web-platform/frontend
pnpm install
pnpm dev
```

### 3. Environment configuration

Configure the environment variables required by the backend and frontend integrations before using connected services.

- Keep API keys and service credentials in local environment files or your deployment provider's secret manager.
- Never commit real credentials, tokens, or private user data.
- Use the project's example environment files when available.

## Deployment

The repository currently links to these hosted surfaces:

- **Frontend:** [cognix-nexus.vercel.app](https://cognix-nexus.vercel.app)
- **Backend:** [cognix-core-ypak.onrender.com](https://cognix-core-ypak.onrender.com)

Availability and feature coverage can change; consult the live services and repository configuration for current deployment status.

## Development direction

The project is being developed around a few consistent principles:

- **Evidence-first:** keep source context attached to extracted knowledge.
- **Human review:** distinguish extracted claims from approved knowledge.
- **Connected context:** make relationships between concepts discoverable.
- **Useful recall:** help knowledge remain accessible after it is captured.
- **Incremental architecture:** keep web, backend, mobile, and integrations understandable as the system grows.

## Contributing

Issues, bug reports, and focused suggestions are welcome.

1. Check existing [Issues](https://github.com/cognixnexus/Cognix-Nexus/issues) before opening a duplicate.
2. Include clear reproduction steps for bugs.
3. Describe expected behavior and actual behavior.
4. Avoid including secrets, private documents, or personal data in reports.

## License

The project currently states **Private Knowledge OS License — All Rights Reserved**. No permission to redistribute or reuse the source should be inferred beyond the terms explicitly published in the repository.

---

<p align="center">
  <sub>Part of the Cognix Core vision · Built for connected knowledge and practical intelligence</sub>
</p>
