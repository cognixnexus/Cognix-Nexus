"""Mindmap, Flashcard Quiz, and Obsidian Knowledge Sync Router for Cognix Nexus."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.concept_graph import ConceptGraphService
from app.services.spaced_repetition_quiz import SpacedRepetitionQuizService

router = APIRouter(prefix="/api/study", tags=["Study Intelligence"])


class MindmapRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=200)
    transcript_or_text: str = Field(..., min_length=10)


class FlashcardGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    text_content: str = Field(..., min_length=10)
    card_count: int = Field(default=3, ge=1, le=10)


class SM2ReviewRequest(BaseModel):
    card_id: str
    quality: int = Field(..., ge=0, le=5)  # 0-2 = Fail, 3 = Hard, 4 = Good, 5 = Easy
    repetition: int = Field(default=0, ge=0)
    interval_days: int = Field(default=1, ge=1)
    ease_factor: float = Field(default=2.5, ge=1.3)


@router.post("/audio-to-mindmap")
def convert_lecture_to_mindmap(payload: MindmapRequest) -> Dict[str, Any]:
    """Convert lecture transcript or audio notes into a structured Mermaid mindmap and tree."""
    mermaid_code = ConceptGraphService.generate_mermaid_mindmap(payload.topic, payload.transcript_or_text)
    
    # Parse hierarchy
    lines = [line.strip() for line in payload.transcript_or_text.split("\n") if line.strip()]
    pillars = []
    current_pillar = None

    for line in lines:
        if line.startswith("#") or line.startswith("**") or ":" in line:
            clean_title = line.strip("#* \t\r\n").split(":", 1)[0].strip()[:40]
            if clean_title:
                current_pillar = {"title": clean_title, "subtopics": []}
                pillars.append(current_pillar)
        elif line.startswith(("-", "*")) and current_pillar:
            sub = line.lstrip("-* ").strip()[:60]
            if sub:
                current_pillar["subtopics"].append(sub)

    if not pillars:
        pillars = [
            {"title": "Core Foundations", "subtopics": ["Key definitions", "Theoretical framework"]},
            {"title": "System Architecture", "subtopics": ["Component dependencies", "Data pipeline"]},
            {"title": "Practical Execution", "subtopics": ["Edge deployment", "Verification suite"]}
        ]

    return {
        "topic": payload.topic,
        "mermaid": mermaid_code,
        "pillars": pillars,
        "raw_char_count": len(payload.transcript_or_text),
    }


@router.post("/generate-flashcards")
def generate_study_flashcards(payload: FlashcardGenerateRequest) -> Dict[str, Any]:
    """Generate SM-2 active recall flashcards from text."""
    cards = []
    lines = [l.strip() for l in payload.text_content.split("\n") if l.strip()]

    # Extract bullet points or sentences as Q&A
    for idx, line in enumerate(lines[:payload.card_count], start=1):
        clean = line.lstrip("-*# 0123456789.")
        if ":" in clean:
            term, desc = clean.split(":", 1)
            q = f"What is the definition and role of {term.strip()} in {payload.topic}?"
            a = desc.strip()
        else:
            q = f"Explain the principle: {clean[:50]}..."
            a = clean

        cards.append({
            "id": f"card_{idx}",
            "topic": payload.topic,
            "question": q,
            "answer": a,
            "repetition": 0,
            "interval_days": 1,
            "ease_factor": 2.5,
        })

    return {
        "topic": payload.topic,
        "cards": cards,
    }


@router.post("/sm2-review")
def calculate_sm2_review(payload: SM2ReviewRequest) -> Dict[str, Any]:
    """Calculate next review interval using SuperMemo SM-2 spaced repetition algorithm."""
    result = SpacedRepetitionQuizService.calculate_sm2(
        repetition=payload.repetition,
        interval_days=payload.interval_days,
        ease_factor=payload.ease_factor,
        quality=payload.quality,
    )
    result["card_id"] = payload.card_id
    return {
        "status": "success",
        "data": result,
    }


@router.get("/obsidian-sync/{topic}")
def export_obsidian_markdown(topic: str, tags: Optional[str] = "cognix,research,knowledge") -> Dict[str, Any]:
    """Generate Obsidian-ready 2-way sync markdown with wikilinks and YAML frontmatter."""
    tag_list = [f"#{t.strip()}" for t in tags.split(",") if t.strip()]
    yaml_tags = "\n".join([f"  - {t.strip()}" for t in tags.split(",") if t.strip()])
    
    markdown_content = f"""---
title: "{topic}"
app: "Cognix Nexus"
sync_status: "synced"
tags:
{yaml_tags}
---

# {topic}

> [!NOTE] Synced from Cognix Nexus Active Brain Layer

## Conceptual Mindmap
```mermaid
mindmap
  root(({topic}))
    Foundations
      Core Principles
      Literature Review
    Execution
      Synthesis
      Active Recall
```

## Related Vault Notes
- [[Knowledge Base/{topic} References]]
- [[Daily Review/Spaced Repetition Log]]

{' '.join(tag_list)}
"""
    return {
        "topic": topic,
        "filename": f"{topic.replace(' ', '_')}.md",
        "markdown": markdown_content,
        "wikilinks": [f"{topic} References", "Spaced Repetition Log"],
    }
