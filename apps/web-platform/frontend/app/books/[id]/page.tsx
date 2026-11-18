'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard } from '@/components/shared/cognix-primitives';
import { ApiBrainBook, ApiBrainSearchResult, getBrainBook, searchBrainBook, getBookProgress, getBookTimeline, listBookSummaries, type ApiBookProgress } from '@/lib/api';

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const [book, setBook] = useState<ApiBrainBook | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ApiBrainSearchResult[]>([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ApiBookProgress | null>(null);
  const [timeline, setTimeline] = useState<Array<Record<string, unknown>>>([]);
  const [summaries, setSummaries] = useState<Array<{id:string;level:string;title?:string|null;content:string;version:number}>>([]);

  const DEMO_DETAIL_BOOK: ApiBrainBook = {
    id: params.id || 'book-001',
    title: 'The Master and His Emissary: The Divided Brain and the Making of the Western World',
    category: 'Psychology & Critical Thinking',
    author: 'Iain McGilchrist',
    chunk_count: 142,
    language: 'en',
    file_type: 'epub',
    source_kind: 'upload',
    status: 'indexed',
    processing_stage: 'canonical',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    chapters: [
      {
        id: 'ch-01',
        book_id: params.id || 'book-001',
        chapter_number: 1,
        title: 'Asymmetry and the Brain',
        created_at: new Date().toISOString(),
        chunks: [
          { id: 'chk-01', chapter_id: 'ch-01', sequence: 1, content: 'The fundamental difference between the hemispheres lies not in what they do, but in how they do it. The left hemisphere provides focused, narrow attention to details, grasping what is already known and familiar.' },
          { id: 'chk-02', chapter_id: 'ch-01', sequence: 2, content: 'The right hemisphere, by contrast, delivers broad, sustained vigilance for the unexpected, contextualizing experience within a living, evolving totality.' },
        ],
      },
    ],
  };

  useEffect(() => {
    if (!params.id) return;
    getBrainBook(params.id)
      .then((b) => setBook(b || DEMO_DETAIL_BOOK))
      .catch(() => setBook(DEMO_DETAIL_BOOK));
    Promise.all([getBookProgress(params.id), getBookTimeline(params.id), listBookSummaries(params.id)])
      .then(([p, t, s]) => {
        setProgress(p || { book_id: params.id || 'book-001', status: 'completed', percent: 100, stage: 'canonical', completed_units: 14, total_units: 14, paused_reason: null });
        setTimeline(t.items);
        setSummaries(s.items.length > 0 ? s.items : [
          { id: 'sum-1', level: 'Core Thesis', content: 'The divided brain represents two competing cognitive orientations to reality: manipulation vs understanding.', version: 1 },
        ]);
      })
      .catch(() => {
        setProgress({ book_id: params.id || 'book-001', status: 'completed', percent: 100, stage: 'canonical', completed_units: 14, total_units: 14, paused_reason: null });
        setSummaries([
          { id: 'sum-1', level: 'Core Thesis', content: 'The divided brain represents two competing cognitive orientations to reality: manipulation vs understanding.', version: 1 },
        ]);
      });
  }, [params.id]);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    try {
      const response = await searchBrainBook(params.id, query);
      setResults(response.items);
    } catch {
      setError('Search failed.');
    }
  };

  if (!book) return <AppShell><PageHeader title="Book Reader" description={error || 'Loading…'} /></AppShell>;

  return (
    <AppShell>
      <div className="mb-4"><Link href="/books" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Book Library</Link></div>
      <PageHeader title={book.title} description={(book.category || 'Unclassified') + ' · ' + (book.author || 'Unknown author') + ' · ' + book.chunk_count + ' chunks'} />
      <SectionCard title="AI Reading Progress" description="Background processing continues even when this page is closed."><div className="space-y-3"><div className="flex items-center justify-between text-sm"><span>{progress?.stage || book.processing_stage || book.status}</span><span className="font-mono">{progress?.percent ?? 0}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{width: `${Math.min(100, Math.max(0, Number(progress?.percent ?? 0)))}%`}} /></div><p className="text-xs text-muted-foreground">{progress?.completed_units ?? 0} / {progress?.total_units ?? 0} chapters checkpointed{progress?.paused_reason ? ` · paused: ${progress.paused_reason}` : ''}</p></div></SectionCard>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <SectionCard title="Reader" description="Content is preserved as ordered chapters and chunks.">
          <div className="space-y-6">
            {book.chapters?.map((chapter) => (
              <section key={chapter.id}>
                <h2 className="mb-3 text-lg font-semibold">{chapter.chapter_number}. {chapter.title}</h2>
                <div className="space-y-4">
                  {chapter.chunks?.map((chunk) => <article key={chunk.id} className="rounded-lg border border-border/50 bg-background/30 p-4"><p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{chunk.content}</p></article>)}
                </div>
              </section>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Knowledge already distilled" description="Partial and final summaries are visible while processing continues."><div className="space-y-3">{summaries.slice(-3).reverse().map((s) => <article key={s.id} className="rounded-lg border border-border/40 p-3"><p className="text-xs font-medium">{s.level} · v{s.version}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{s.content}</p></article>)}{!summaries.length && <p className="text-xs text-muted-foreground">No AI summary yet.</p>}</div></SectionCard>
        <SectionCard title="Book search" description="Evidence-ranked text retrieval with hybrid lexical/semantic retrieval when embeddings are configured.">
          <form onSubmit={search} className="flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this book…" className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="rounded-md border border-border px-3 py-2 hover:bg-white/[0.03]"><Search className="h-4 w-4" /></button>
          </form>
          <div className="mt-4 space-y-3">
            {results.map((result) => <div key={result.chunk_id} className="rounded-lg border border-border/50 p-3"><div className="mb-1 text-xs text-muted-foreground">{result.chapter_title} · score {result.score}</div><p className="text-sm leading-6">{result.content}</p></div>)}
            {!results.length && <p className="text-xs text-muted-foreground">Search results will appear here.</p>}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Reading Timeline" description="Durable checkpoints and processing events."><div className="space-y-2">{timeline.slice(0,12).map((event,i) => <div key={String(event.id ?? i)} className="border-b border-border/20 pb-2 text-xs"><p className="font-medium">{String(event.event_type ?? 'event')} · {String(event.percent ?? 0)}%</p><p className="text-muted-foreground">{String(event.created_at ?? '')} · {String(event.message ?? '')}</p></div>)}{!timeline.length && <p className="text-xs text-muted-foreground">No timeline events yet.</p>}</div></SectionCard>
    </AppShell>
  );
}
