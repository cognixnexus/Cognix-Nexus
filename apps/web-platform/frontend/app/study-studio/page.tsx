'use client';

import React, { useState } from 'react';
import { 
  Network, Sparkles, BookOpen, Brain, RotateCcw, 
  Check, ArrowRight, Download, Copy, Share2, Layers, Award, Clock
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';

interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
}

export default function StudyStudioPage() {
  const [activeTab, setActiveTab] = useState<'mindmap' | 'flashcards' | 'obsidian'>('mindmap');

  // Mindmap State
  const [topic, setTopic] = useState('Neural Architecture Search & Foundation Models');
  const [transcript, setTranscript] = useState(
    '# Foundations\n- Differentiable Architecture Search (DARTS) continuous relaxation\n- Evolutionary weight-sharing supernets\n# Performance Objectives\n- Pareto-optimal latency constraints on edge TPUs\n- FLOPs reduction via structured channel pruning\n# Knowledge Distillation\n- Teacher-student cross-entropy temperature scaling\n- Feature representation alignment across latent layers'
  );
  const [mermaidCode, setMermaidCode] = useState(
    'mindmap\n  root((Neural Architecture Search))\n    Foundations\n      DARTS Continuous Relaxation\n      Weight-sharing Supernets\n    Performance Objectives\n      Pareto-optimal Latency\n      Structured Channel Pruning\n    Knowledge Distillation\n      Teacher-Student Cross-Entropy\n      Latent Feature Alignment'
  );

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 'card-1',
      topic: 'Neural Architecture Search',
      question: 'What is the primary computational benefit of weight-sharing supernets in NAS?',
      answer: 'Supernets eliminate the need to train every candidate architecture from scratch by training a single shared-weight DAG and sampling sub-networks.',
      repetition: 2,
      intervalDays: 6,
      easeFactor: 2.5,
    },
    {
      id: 'card-2',
      topic: 'Optimization',
      question: 'How does temperature scaling assist student models in knowledge distillation?',
      answer: 'A higher temperature softens logits probability distributions, revealing dark knowledge about inter-class structural correlations.',
      repetition: 0,
      intervalDays: 1,
      easeFactor: 2.5,
    },
    {
      id: 'card-3',
      topic: 'Spaced Repetition',
      question: 'In the SuperMemo SM-2 algorithm, what does quality score 3 indicate?',
      answer: 'Pass with serious difficulty: increments repetition count but slightly degrades the ease factor.',
      repetition: 1,
      intervalDays: 1,
      easeFactor: 2.36,
    }
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedObsidian, setCopiedObsidian] = useState(false);

  const activeCard = flashcards[currentCardIndex];

  const handleRateCard = (quality: number) => {
    // SM-2 calculation
    const q = Math.max(0, Math.min(5, quality));
    let newEf = activeCard.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    newEf = Math.max(1.3, parseFloat(newEf.toFixed(2)));

    let newRep = activeCard.repetition;
    let newInterval = activeCard.intervalDays;

    if (q < 3) {
      newRep = 0;
      newInterval = 1;
    } else {
      newRep = activeCard.repetition + 1;
      if (newRep === 1) newInterval = 1;
      else if (newRep === 2) newInterval = 6;
      else newInterval = Math.round(activeCard.intervalDays * newEf);
    }

    setFlashcards((prev) => 
      prev.map((c, i) => i === currentCardIndex ? { ...c, repetition: newRep, intervalDays: newInterval, easeFactor: newEf } : c)
    );

    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const obsidianMarkdown = `---
title: "${topic}"
app: "Cognix Nexus"
created_at: "2026-11-22"
tags:
  - cognix
  - research
  - active-recall
  - neural-networks
---

# ${topic}

> [!NOTE] Synced from Cognix Nexus Active Brain Layer

## Conceptual Mindmap
\`\`\`mermaid
${mermaidCode}
\`\`\`

## Active Flashcard Prompts
${flashcards.map((f, idx) => `### Q${idx + 1}: ${f.question}\n- **Answer**: ${f.answer}\n- **SM-2 Status**: Repetition ${f.repetition} | Interval ${f.intervalDays}d | Ease Factor ${f.easeFactor}\n`).join('\n')}

## Vault Wikilinks
- [[Knowledge Base/${topic} Notes]]
- [[Cognix Brain/Spaced Repetition Review]]
`;

  const handleCopyObsidian = () => {
    navigator.clipboard.writeText(obsidianMarkdown);
    setCopiedObsidian(true);
    setTimeout(() => setCopiedObsidian(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Mindmap, Active Recall & Obsidian Sync"
          description="Convert audio lectures to hierarchical visual mindmaps, master concepts with SM-2 spaced repetition, and 2-way sync with Obsidian vaults."
          action={
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Cognitive Intelligence
            </span>
          }
        />

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <button
            onClick={() => setActiveTab('mindmap')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'mindmap'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Network className="w-4 h-4" />
            Lecture to Mindmap
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'flashcards'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="w-4 h-4" />
            Spaced Repetition Quiz
          </button>
          <button
            onClick={() => setActiveTab('obsidian')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'obsidian'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Obsidian 2-Way Sync
          </button>
        </div>

        {/* TAB 1: MINDMAP */}
        {activeTab === 'mindmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <SectionCard title="Lecture Audio & Transcript Input">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-muted-foreground block mb-1">Knowledge Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Lecture Text / Audio Outline</label>
                    <textarea
                      rows={8}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 text-foreground font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <GlowButton
                    onClick={() => {
                      setMermaidCode(
                        `mindmap\n  root((${topic}))\n    Core Principles\n      Theoretical Foundations\n      Parametric Relaxation\n    Execution Strategy\n      Structured Channel Pruning\n      Latency Budget Verification`
                      );
                    }}
                    className="w-full"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Synthesize Hierarchical Mindmap
                  </GlowButton>
                </div>
              </SectionCard>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <SectionCard title="Visual Mindmap Syntax & Representation">
                <div className="p-4 rounded-xl bg-background border border-border font-mono text-xs text-cyan-300 whitespace-pre-wrap overflow-x-auto">
                  {mermaidCode}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                  <span>Structured into 3 main branches and 6 leaf concepts</span>
                  <button 
                    onClick={() => setActiveTab('obsidian')}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Send to Obsidian Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {/* TAB 2: SPACED REPETITION FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
              <div className="flex items-center gap-3">
                <span>Repetition: <strong className="text-foreground">{activeCard.repetition}</strong></span>
                <span>Interval: <strong className="text-cyan-400">{activeCard.intervalDays}d</strong></span>
                <span>Ease Factor: <strong className="text-emerald-400">{activeCard.easeFactor}</strong></span>
              </div>
            </div>

            {/* Flashcard 3D Card */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[240px] p-8 rounded-2xl bg-card border border-border/80 shadow-xl cursor-pointer flex flex-col justify-between hover:border-cyan-500/50 transition-all select-none"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-cyan-400 uppercase">{activeCard.topic}</span>
                <span className="text-[11px] bg-secondary px-2 py-0.5 rounded">
                  {isFlipped ? 'Answer View' : 'Click to Flip'}
                </span>
              </div>

              <div className="py-6 text-center">
                {isFlipped ? (
                  <p className="text-base text-foreground font-medium leading-relaxed">
                    {activeCard.answer}
                  </p>
                ) : (
                  <p className="text-base font-semibold text-foreground leading-relaxed">
                    {activeCard.question}
                  </p>
                )}
              </div>

              <div className="text-center text-[11px] text-muted-foreground">
                {isFlipped ? 'Rate your recall accuracy below' : 'Tap anywhere to reveal active recall solution'}
              </div>
            </div>

            {/* Quality Rating Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handleRateCard(1)}
                  className="p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive text-xs font-semibold transition-all"
                >
                  Again (0-1)
                  <span className="block text-[10px] opacity-80 mt-0.5">Repeat (1d)</span>
                </button>
                <button
                  onClick={() => handleRateCard(3)}
                  className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all"
                >
                  Hard (3)
                  <span className="block text-[10px] opacity-80 mt-0.5">+1 Day</span>
                </button>
                <button
                  onClick={() => handleRateCard(4)}
                  className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all"
                >
                  Good (4)
                  <span className="block text-[10px] opacity-80 mt-0.5">+6 Days</span>
                </button>
                <button
                  onClick={() => handleRateCard(5)}
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
                >
                  Easy (5)
                  <span className="block text-[10px] opacity-80 mt-0.5">+14+ Days</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OBSIDIAN 2-WAY SYNC */}
        {activeTab === 'obsidian' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Obsidian Vault Markdown Contract</h3>
                <p className="text-xs text-muted-foreground">
                  Includes YAML frontmatter, [[wikilinks]], tags, and embedded Mermaid graph for bidirectional sync.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyObsidian}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/25"
                >
                  {copiedObsidian ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedObsidian ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {obsidianMarkdown}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
