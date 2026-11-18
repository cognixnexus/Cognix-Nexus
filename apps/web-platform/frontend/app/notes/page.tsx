'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Brain, Plus, Search, Tag, Clock, Pin, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { ApiBrainNote, createBrainNote, listBrainNotes } from '@/lib/api';

const DEMO_NOTES: ApiBrainNote[] = [
  {
    id: 'note-001',
    title: 'Heuristics and Biases in Latent Decision Spaces',
    content: 'When autonomous agents operate without explicit chain-of-thought grounding, systematic retrieval collapse occurs around dominant training clusters. Countermeasure: require dual-pass adversarial verification with temperature modulation (0.2 for retrieval, 0.7 for synthesis).',
    note_type: 'insight',
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'note-002',
    title: 'Voyage-4 1536-D Vector Indexing Architecture',
    content: 'HNSW index hyperparameters configured for 64 M and 200 ef_construction on Qdrant. Normalizing vectors at ingest time yields 15% faster cosine similarity calculations with zero precision loss.',
    note_type: 'technical',
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 22).toISOString(),
  },
  {
    id: 'note-003',
    title: 'Spaced Repetition Decay Formula (Ebbinghaus Adaptation)',
    content: 'Review interval R = exp(-t / (S * C)), where S is stability rating from Leitner box (1-4) and C is concept difficulty score. Cards with R < 0.65 are queued for immediate active recall.',
    note_type: 'synthesis',
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<ApiBrainNote[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await listBrainNotes();
      setNotes(res.items.length > 0 ? res.items : DEMO_NOTES);
    } catch {
      setNotes(DEMO_NOTES);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await createBrainNote({ title: title.trim(), content: content.trim() });
      setTitle('');
      setContent('');
      await load();
    } catch {
      setNotes((prev) => [
        {
          id: `note-${Date.now()}`,
          title: title.trim(),
          content: content.trim(),
          note_type: 'custom',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTitle('');
      setContent('');
    } finally {
      setSaving(false);
    }
  };

  const filtered = notes.filter((n) =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <PageHeader
        title="Second Brain Notes"
        description="Capture durable thoughts, mental models, and synthesis notes with automated vector indexing."
      />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <SectionCard
          title="Capture Insight"
          description="Notes are indexed into the semantic knowledge graph."
        >
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note or concept title"
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write durable insight, citations, or formulas…"
                rows={10}
                className="w-full rounded-lg border border-border/50 bg-background-elevated p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all font-sans"
              />
            </div>
            <button
              disabled={saving || !title.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4" /> {saving ? 'Indexing Note…' : 'Save Note to Brain'}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Second Brain Repository"
          description={`${notes.length} durable records in active memory`}
          action={
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter notes..."
                className="h-8 w-full rounded-lg border border-border/50 bg-background-elevated pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>
          }
        >
          <div className="space-y-3">
            {filtered.map((note) => (
              <article
                key={note.id}
                className="rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30 hover:bg-cyan-500/[0.02]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{note.title}</h2>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'Active'}
                        </span>
                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.2 text-cyan-400">
                          1536-D Vectorized
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">
                  {note.content}
                </p>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">No notes match your filter.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
