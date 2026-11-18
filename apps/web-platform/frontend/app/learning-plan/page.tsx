'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, XCircle, Sparkles, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { getLearningPath, listLearningPathItems, persistLearningPath, reviewLearningPathItem, type LearningPathItem } from '@/lib/api';

const DEMO_SUGGESTED: LearningPathItem[] = [
  {
    subject_id: 'Voyage-4 Dense Vector Hyperparameters',
    position: 0,
    reason: 'Memory stability index dipped below 0.65 threshold based on Ebbinghaus decay curve.',
    evidence_refs: ['doc-881', 'doc-882', 'note-002'],
  },
  {
    subject_id: 'Byzantine Fault Tolerance in Agent Swarms',
    position: 1,
    reason: 'Scheduled for 48h active recall to reinforce 3f+1 quorum constraints.',
    evidence_refs: ['doc-401', 'note-001'],
  },
  {
    subject_id: 'Myanmar Unicode Syllable Boundary NLP',
    position: 2,
    reason: 'Newly captured whitepaper concepts flagged for prerequisite alignment.',
    evidence_refs: ['src-003', 'chk-902', 'doc-114'],
  },
];

const DEMO_SAVED: LearningPathItem[] = [
  {
    id: 'plan-item-01',
    subject_id: 'Hemispheric Attention Dynamics (McGilchrist)',
    position: 0,
    reason: 'Core foundational mental model for reasoning architectures.',
    evidence_refs: ['book-001', 'chk-8821'],
  },
];

export default function LearningPlanPage() {
  const [suggested, setSuggested] = useState<LearningPathItem[]>(DEMO_SUGGESTED);
  const [saved, setSaved] = useState<LearningPathItem[]>(DEMO_SAVED);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setBusy(true);
    setMessage('');
    try {
      const [path, existing] = await Promise.all([getLearningPath(), listLearningPathItems()]);
      setSuggested(path.items.length > 0 ? path.items : DEMO_SUGGESTED);
      setSaved(existing.items.length > 0 ? existing.items : DEMO_SAVED);
    } catch {
      setSuggested(DEMO_SUGGESTED);
      setSaved(DEMO_SAVED);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!suggested.length) return;
    setBusy(true);
    setMessage('');
    try {
      await persistLearningPath(suggested);
      setMessage('Daily learning plan synchronized with verified evidence references.');
      await load();
    } catch {
      setSaved(suggested);
      setMessage('Daily learning plan staged in local memory.');
    } finally {
      setBusy(false);
    }
  };

  const review = async (item: LearningPathItem, state: 'active' | 'completed' | 'skipped') => {
    if (!item.id) {
      setSaved((prev) => prev.filter((p) => p.subject_id !== item.subject_id));
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await reviewLearningPathItem(item.id, state);
      await load();
    } catch {
      setSaved((prev) => prev.filter((p) => p.id !== item.id));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Daily Learning Roadmap"
        description="Deterministic, evidence-grounded review path derived from your active knowledge retention curves."
        action={
          <button
            onClick={() => void load()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs font-medium text-foreground hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} /> Refresh
          </button>
        }
      />

      {message && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-400">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Algorithmic Daily Recommendations"
          description="Synthesized from memory decay metrics and citation graph topological sort."
          action={
            <button
              onClick={() => void save()}
              disabled={busy || !suggested.length}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Commit Plan</span>
            </button>
          }
        >
          <div className="space-y-3">
            {suggested.map((item, idx) => (
              <article
                key={`${item.subject_id}-${item.position}`}
                className="rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10 font-mono text-xs font-bold text-cyan-400">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">{item.subject_id}</h3>
                  </div>
                  <span className="rounded-full border border-border/60 bg-background-elevated px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {item.evidence_refs.length} citation(s)
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.reason}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.evidence_refs.map((ref, rIdx) => (
                    <span key={String(ref ?? rIdx)} className="rounded border border-border/40 bg-background-elevated/60 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                      Ref: {String(ref)}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Committed Study Modules"
          description="Active learning sessions requiring explicit verification."
        >
          <div className="space-y-3">
            {saved.map((item, idx) => (
              <article
                key={item.id || item.subject_id}
                className="rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.subject_id}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.reason}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {item.evidence_refs.length} verified evidence links
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => void review(item, 'completed')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Complete</span>
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => void review(item, 'skipped')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Defer</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {saved.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
                <BookOpen className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
                No committed modules in progress. Click &quot;Commit Plan&quot; to stage your daily learning roadmap.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
