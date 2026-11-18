'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, UploadCloud, Layers, Sparkles, ArrowRight, Loader2, FileText } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { ApiBrainBook, createBrainBook, listBrainBooks, uploadBrainBook } from '@/lib/api';

const DEMO_BOOKS: ApiBrainBook[] = [
  {
    id: 'book-001',
    title: 'The Master and His Emissary: The Divided Brain and the Making of the Western World',
    category: 'Psychology & Critical Thinking',
    chunk_count: 142,
    language: 'en',
    file_type: 'epub',
    source_kind: 'upload',
    status: 'indexed',
    processing_stage: 'canonical',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'book-002',
    title: 'Designing Data-Intensive Applications: The Big Ideas Behind Reliable Systems',
    category: 'Future Tech',
    chunk_count: 320,
    language: 'en',
    file_type: 'pdf',
    source_kind: 'upload',
    status: 'indexed',
    processing_stage: 'canonical',
    created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
  {
    id: 'book-003',
    title: 'Thinking, Fast and Slow: Intuition and Heuristics',
    category: 'Psychology & Critical Thinking',
    chunk_count: 285,
    language: 'en',
    file_type: 'pdf',
    source_kind: 'upload',
    status: 'indexed',
    processing_stage: 'canonical',
    created_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
  },
];

export default function BooksPage() {
  const [books, setBooks] = useState<ApiBrainBook[]>([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('Unclassified');
  const [notice, setNotice] = useState('');

  const load = async () => {
    try {
      const res = await listBrainBooks();
      setBooks(res.items.length > 0 ? res.items : DEMO_BOOKS);
    } catch {
      setBooks(DEMO_BOOKS);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !text.trim()) return;
    setSaving(true);
    setError('');
    try {
      await createBrainBook({ title: title.trim(), text: text.trim(), file_type: 'text', category });
      setTitle('');
      setText('');
      await load();
    } catch {
      setError('Book could not be imported.');
    } finally {
      setSaving(false);
    }
  };

  const upload = async () => {
    if (files.length === 0) return;
    setSaving(true);
    setError('');
    try {
      let count = 0;
      for (const f of files) {
        await uploadBrainBook(f, 'en', undefined, category);
        count++;
      }
      setNotice(count > 1 ? `${count} books queued for background AI reading.` : 'Book queued for background AI reading.');
      setFiles([]);
      await load();
    } catch {
      setError('Book upload failed. Make sure persistent book storage is configured.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Book Library"
        description="Your long-form reading layer for the Cognix Brain Vault with automated chunking and neural distillation."
      />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <SectionCard
          title="Vault Volumes"
          description={`${books.length} curated volumes indexed for synthesis`}
        >
          <div className="space-y-3">
            {books.map((book) => (
              <Link
                key={book.id}
                href={'/books/' + book.id}
                className="group block rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                        {book.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-border/60 bg-background-elevated px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {book.category || 'Unclassified'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-400">
                          <Layers className="h-3 w-3" /> {book.chunk_count} chunks
                        </span>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400">
                          {book.processing_stage || book.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-cyan-400 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Intake Volume"
          description="Upload PDF, EPUB, DOCX or TXT for background chunking and vector indexing."
        >
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
              <select
                aria-label="Book category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground focus-glow focus:outline-none transition-all"
              >
                <option>Unclassified</option>
                <option>Business, Entrepreneurship & Finance</option>
                <option>Communication & Negotiation</option>
                <option>Creativity & Tech</option>
                <option>Future Tech</option>
                <option>Leadership & Management</option>
                <option>Productivity, Habits & Discipline</option>
                <option>Psychology & Critical Thinking</option>
                <option>Self-Help & Emotional Intelligence</option>
                <option>Stoicism & Philosophy</option>
              </select>
            </div>

            <div className="rounded-xl border border-dashed border-border/60 bg-background-elevated/40 p-5 text-center transition-colors hover:border-cyan-500/40">
              <UploadCloud className="mx-auto h-8 w-8 text-cyan-400 mb-2" />
              <p className="text-xs font-medium text-foreground">Select books for automated processing</p>
              <p className="mt-1 text-[11px] text-muted-foreground">PDF, EPUB, DOCX, TXT</p>
              <input
                type="file"
                multiple
                accept=".pdf,.epub,.docx,.txt,application/pdf,application/epub+zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cyan-400 hover:file:bg-cyan-500/20"
              />
            </div>

            {files.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-400">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>{files.length} volume(s) staged for neural intake</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => files.length > 0 && upload()}
              disabled={files.length === 0 || saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {saving ? 'Processing Volumes…' : files.length > 1 ? `Upload ${files.length} Volumes (Bulk)` : 'Upload Volume'}
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
              <span className="relative bg-background-surface px-2 text-[10px] uppercase tracking-wider text-muted-foreground">or paste manual notes</span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book or paper title"
              className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste excerpt or chapter text here…"
              rows={6}
              className="w-full rounded-lg border border-border/50 bg-background-elevated p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
            />
            {notice && <p className="text-xs text-emerald-400 font-medium" role="status">{notice}</p>}
            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            <button
              disabled={saving || !title.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/60 bg-background-elevated px-4 py-2 text-xs font-medium text-foreground hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4" /> {saving ? 'Importing…' : 'Save Excerpt'}
            </button>
          </form>
        </SectionCard>
      </div>
    </AppShell>
  );
}
