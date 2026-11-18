'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, Layers, BookOpen, Sparkles, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  docsCount: number;
  booksCount: number;
  vectorsCount: number;
  tags: string[];
  updatedAt: string;
}

const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-01',
    name: 'Autonomous AI Agents & Consensus 2026',
    description: 'Multi-agent coordination protocols, Byzantine fault tolerance thresholds, and latent thought models.',
    docsCount: 18,
    booksCount: 4,
    vectorsCount: 1420,
    tags: ['Agents', 'Consensus', 'Latent Reasoning'],
    updatedAt: '2 hours ago',
  },
  {
    id: 'col-02',
    name: 'High-Dimensional Vector Memory Benchmarks',
    description: 'Voyage-4, Cohere, and Qdrant 1536-D retrieval latency, recall curves, and quantization studies.',
    docsCount: 12,
    booksCount: 2,
    vectorsCount: 890,
    tags: ['Vector DB', 'Voyage-4', 'HNSW'],
    updatedAt: 'Yesterday',
  },
  {
    id: 'col-03',
    name: 'Myanmar NLP & Bilingual Corpus Vault',
    description: 'Syllable boundary segmentation heuristics, Myanmar3 OCR tuning, and cross-lingual translation gates.',
    docsCount: 9,
    booksCount: 3,
    vectorsCount: 650,
    tags: ['Myanmar3', 'NLP', 'Translation'],
    updatedAt: '3 days ago',
  },
  {
    id: 'col-04',
    name: 'Cognitive Architecture & Mental Models',
    description: 'Hemispheric attention asymmetry (McGilchrist), dual-process theory, and active recall schedules.',
    docsCount: 15,
    booksCount: 5,
    vectorsCount: 1120,
    tags: ['Cognitive Science', 'McGilchrist', 'Memory'],
    updatedAt: '4 days ago',
  },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newCol: CollectionItem = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || 'Custom curated research collection.',
      docsCount: 1,
      booksCount: 0,
      vectorsCount: 48,
      tags: tagInput ? tagInput.split(',').map((t) => t.trim()).filter(Boolean) : ['Research'],
      updatedAt: 'Just now',
    };
    setCollections([newCol, ...collections]);
    setName('');
    setDesc('');
    setTagInput('');
    setIsOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Research Collections"
        description="Organize research into durable, named knowledge dossiers for downstream review, vector synthesis, and export."
        action={
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </button>
        }
      />

      {isOpen && (
        <div className="mb-6 rounded-xl border border-cyan-500/40 bg-background-elevated p-5 shadow-2xl animate-fade-in-up">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-cyan-400" /> Create Research Dossier
          </h2>
          <form onSubmit={addCollection} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Collection name (e.g. Quantum Reasoning)"
                required
                className="w-full rounded-lg border border-border/50 bg-background-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Tags, comma-separated (e.g. AI, Vectors)"
                className="w-full rounded-lg border border-border/50 bg-background-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description & research objective…"
              rows={3}
              className="w-full rounded-lg border border-border/50 bg-background-surface p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-border/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Create Dossier
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((col) => (
          <div
            key={col.id}
            className="group rounded-xl border border-border/50 bg-background-surface/40 p-5 transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                    {col.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-mono text-muted-foreground">
                    Updated {col.updatedAt}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {col.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {col.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-background-elevated px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs">
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-cyan-400" /> {col.docsCount} docs
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-violet-400" /> {col.booksCount} books
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Layers className="h-3.5 w-3.5" /> {col.vectorsCount} vectors
                </span>
              </div>

              <Link
                href="/knowledge"
                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Explore</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
