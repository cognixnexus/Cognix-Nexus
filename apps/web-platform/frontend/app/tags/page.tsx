'use client';

import { useState } from 'react';
import { Tags, Hash, Plus, Search, Layers, TrendingUp, Filter } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';

interface TagGroup {
  category: string;
  tags: { name: string; count: number; growth: string }[];
}

const INITIAL_GROUPS: TagGroup[] = [
  {
    category: 'Architecture & Inference',
    tags: [
      { name: 'Voyage-4 Vectors', count: 142, growth: '+28%' },
      { name: 'Byzantine Consensus', count: 86, growth: '+14%' },
      { name: 'Latent Thought Models', count: 119, growth: '+45%' },
      { name: 'HNSW Indexing', count: 64, growth: '+8%' },
      { name: 'FastMCP Protocol', count: 52, growth: '+33%' },
    ],
  },
  {
    category: 'Cognitive Science & Memory',
    tags: [
      { name: 'Hemispheric Attention', count: 98, growth: '+12%' },
      { name: 'Spaced Repetition', count: 154, growth: '+19%' },
      { name: 'Active Recall', count: 130, growth: '+22%' },
      { name: 'Feynman Technique', count: 75, growth: '+15%' },
      { name: 'Dual-Process Theory', count: 48, growth: '+6%' },
    ],
  },
  {
    category: 'Multilingual & Localization',
    tags: [
      { name: 'Myanmar3 Unicode', count: 112, growth: '+36%' },
      { name: 'Syllable Segmentation', count: 68, growth: '+24%' },
      { name: 'Cross-Lingual RAG', count: 85, growth: '+40%' },
      { name: 'Tesseract OCR Engine', count: 94, growth: '+11%' },
    ],
  },
  {
    category: 'Security & Zero-Trust',
    tags: [
      { name: 'PBKDF2-SHA256', count: 42, growth: '+5%' },
      { name: 'AES-GCM-256', count: 56, growth: '+9%' },
      { name: 'Telegram Bridge (215)', count: 78, growth: '+18%' },
      { name: 'Zero-Knowledge Storage', count: 35, growth: '+10%' },
    ],
  },
];

export default function TagsPage() {
  const [groups, setGroups] = useState<TagGroup[]>(INITIAL_GROUPS);
  const [search, setSearch] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedCat, setSelectedCat] = useState('Architecture & Inference');

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.category === selectedCat
          ? { ...g, tags: [{ name: newTag.trim(), count: 1, growth: 'New' }, ...g.tags] }
          : g
      )
    );
    setNewTag('');
  };

  const totalTags = groups.reduce((acc, g) => acc + g.tags.length, 0);

  return (
    <AppShell>
      <PageHeader
        title="Controlled Vocabulary &amp; Topics"
        description="Controlled semantic ontology and taxonomy graph for knowledge discovery, cross-referencing, and vector indexing."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <SectionCard
          title="Taxonomy Management"
          description="Register new controlled vocabulary tokens."
        >
          <form onSubmit={addTag} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Domain Category</label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground focus-glow focus:outline-none transition-all"
              >
                {groups.map((g) => (
                  <option key={g.category} value={g.category}>{g.category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Topic Token</label>
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g. Reciprocal Rank Fusion"
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!newTag.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4" /> Add to Controlled Ontology
            </button>

            <div className="rounded-lg border border-border/40 bg-background-elevated/40 p-3 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-1">Graph Indexing Rule:</span>
              Registered topics are automatically reconciled across vector chunks, source metadata, and flashcard decks during nightly batch cycles.
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Active Controlled Vocabulary"
          description={`${totalTags} canonical tokens categorized across 4 domain clusters`}
          action={
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter vocabulary..."
                className="h-8 w-full rounded-lg border border-border/50 bg-background-elevated pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>
          }
        >
          <div className="space-y-6">
            {groups.map((group) => {
              const matchingTags = group.tags.filter((t) =>
                !search || t.name.toLowerCase().includes(search.toLowerCase())
              );
              if (matchingTags.length === 0) return null;
              return (
                <div key={group.category} className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchingTags.map((tag) => (
                      <div
                        key={tag.name}
                        className="group flex items-center gap-2 rounded-xl border border-border/50 bg-background-surface/60 px-3 py-2 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/[0.02]"
                      >
                        <Hash className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-xs font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                          {tag.name}
                        </span>
                        <span className="rounded-full bg-background-elevated px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {tag.count}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400">
                          {tag.growth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
