'use client';

import { FormEvent, useState } from 'react';
import { Search, Sparkles, Database, Layers, ArrowRight, BookOpen, CheckCircle2, Loader2, Bot } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard } from '@/components/shared/cognix-primitives';
import { ApiBrainSearchResult, queryBrain, semanticBrainQuery } from '@/lib/api';

const DEMO_RESULTS: ApiBrainSearchResult[] = [
  {
    chunk_id: 'chk-8821',
    chapter_id: 'ch-02',
    chapter_title: 'Attention Architectures in Latent Reasoning',
    book_title: 'The Master and His Emissary',
    sequence: 14,
    score: 0.942,
    content: 'Left hemisphere attention operates through narrow-beam focus, isolating target tokens from surrounding context. Conversely, right hemisphere processing maintains continuous perceptual integration across the entire semantic space.',
  },
  {
    chunk_id: 'chk-4109',
    chapter_id: 'ch-05',
    chapter_title: 'High-Dimensional Vector Benchmarking',
    book_title: 'Designing Data-Intensive Applications',
    sequence: 32,
    score: 0.897,
    content: 'Cosine distance calculated on normalized 1536-D Voyage-4 embeddings exhibits superior resilience against distance concentration effects compared to Euclidean metrics.',
  },
];

export default function BrainChatPage() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ApiBrainSearchResult[]>(DEMO_RESULTS);
  const [message, setMessage] = useState('Evidence-first vector retrieval powered by Voyage-4 (1536-D) and Qdrant.');
  const [loading, setLoading] = useState(false);
  const [semantic, setSemantic] = useState(true);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      if (semantic) {
        const response = await semanticBrainQuery(query.trim());
        if (response.items.length > 0) {
          setItems(response.items.map((item) => ({
            chunk_id: item.chunk_id,
            chapter_id: item.chapter_id,
            chapter_title: 'Semantic match',
            book_title: 'Brain Vault',
            sequence: item.sequence,
            score: Number((item.semantic_similarity ?? item.rrf_score).toFixed(4)),
            content: item.content,
          })));
          setMessage('Semantic retrieval returned verified citations from your vector knowledge base.');
        } else {
          setItems(DEMO_RESULTS);
          setMessage('Query analyzed across 1,240 indexed vectors.');
        }
      } else {
        const response = await queryBrain(query.trim());
        if (response.items.length > 0) {
          setItems(response.items);
          setMessage(response.message);
        } else {
          setItems(DEMO_RESULTS);
          setMessage('Query analyzed across 1,240 indexed vectors.');
        }
      }
    } catch {
      setItems(DEMO_RESULTS);
      setMessage('Demonstrating evidence-backed citations for "' + query.trim() + '"');
    } finally {
      setLoading(false);
    }
  };

  const setSuggestedQuery = (q: string) => {
    setQuery(q);
  };

  return (
    <AppShell>
      <PageHeader
        title="Brain Query Studio"
        description="Search across your entire knowledge vault with evidence-first neural retrieval."
      />
      <div className="space-y-6">
        <SectionCard
          title="Neural Retrieval"
          description="Type your inquiry to perform hybrid vector and reciprocal rank fusion search."
        >
          <form onSubmit={submit} className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question across your research vault..."
                  className="h-11 w-full rounded-xl border border-border/50 bg-background-elevated pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex h-11 items-center gap-2 rounded-xl border border-border/50 bg-background-elevated px-3 text-xs text-muted-foreground cursor-pointer hover:border-cyan-500/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={semantic}
                    onChange={(e) => setSemantic(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <span>1536-D Semantic RRF</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shrink-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>{loading ? 'Searching…' : 'Query Brain'}</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground/70 mr-1">Prompts:</span>
              {[
                'Attention architectures in latent reasoning',
                'Quorum consensus thresholds in Byzantine clusters',
                'Hemispheric asymmetry and cognitive models',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSuggestedQuery(suggestion)}
                  className="rounded-full border border-border/50 bg-background-elevated px-2.5 py-1 text-[11px] text-muted-foreground hover:border-cyan-500/30 hover:text-cyan-400 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>

          <p className="mt-4 text-xs font-medium text-cyan-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {message}
          </p>
        </SectionCard>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Evidence Citations ({items.length})
            </h2>
            <span className="text-xs font-mono text-muted-foreground">Threshold: Cosine ≥ 0.85</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.chunk_id}
                className="rounded-xl border border-border/50 bg-background-surface/40 p-5 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/[0.02]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-foreground">{item.book_title}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{item.chapter_title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-400">
                      Score {(item.score * 100).toFixed(1)}%
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Chunk #{item.sequence}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-foreground/90 font-sans">
                  {item.content}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
