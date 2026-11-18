'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Languages, ArrowRight, XCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { apiSourceToSource, approveSource, listSources, requestSourceRevision, type ApiSource } from '@/lib/api';
import { FlagBadge, StageBadge } from '@/components/research/workspace-ui';

const DEMO_REVIEW_SOURCES: ApiSource[] = [
  {
    id: 'src-003',
    url: 'https://deepmind.google/research/multi-agent',
    note: 'Multi-Agent Consensus Protocols for Critical Systems',
    status: 'needs_review',
    processing_stage: 'needs_review',
    source_trust: 'authoritative',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    critical_warnings: ['Requires human-in-the-loop signoff before Drive distribution'],
    claims: [
      { id: 'clm-1', text: 'Quorum consensus latency stays below 45ms across 12-node cluster', confidence: '0.98', verification_state: 'verified', created_at: new Date().toISOString() },
      { id: 'clm-2', text: 'Fault tolerance threshold maintains 3f+1 constraint', confidence: '0.95', verification_state: 'verified', created_at: new Date().toISOString() },
    ],
    ai_summary: 'Consensus protocols with Byzantine fault tolerance tested on 12-node agent clusters with zero state fork.',
    key_points: ['Fault tolerance threshold 3f+1', 'Quorum voting latency < 45ms'],
    myanmar_translation: '၁၂ လုံးတွဲ အေးဂျင့်ကွန်ရက်များတွင် ဗဟိုချုပ်ကိုင်မှုမဲ့ သဘောတူညီချက်ရယူခြင်း စနစ်ကို စမ်းသပ်စစ်ဆေးခဲ့သည်။',
  },
  {
    id: 'src-004',
    url: 'https://arxiv.org/abs/2603.11890',
    note: 'Syllable-Boundary Heuristics for Low-Resource NLP Corpus',
    status: 'needs_review',
    processing_stage: 'needs_review',
    source_trust: 'peer_reviewed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    critical_warnings: [],
    claims: [
      { id: 'clm-3', text: 'Regex syllable breaking preserves Unicode conjuncts with 99.2% accuracy', confidence: '0.99', verification_state: 'verified', created_at: new Date().toISOString() },
    ],
    ai_summary: 'Rule-based segmenter outperforms statistical tokenizers on Burmese legal and administrative texts.',
    key_points: ['99.2% accuracy on conjuncts', 'Zero external model dependency'],
    myanmar_translation: 'မြန်မာစာလုံးပေါင်း သတ်ပုံခွဲခြမ်းစိတ်ဖြာခြင်းဆိုင်ရာ စည်းမျဉ်းများ။',
  },
];

export default function ReviewPage() {
  const [sources, setSources] = useState<ApiSource[]>(DEMO_REVIEW_SOURCES);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    listSources()
      .then((r) => {
        const needsReview = r.items.filter((s) => s.status === 'needs_review');
        if (needsReview.length > 0) setSources(needsReview);
        else setSources(DEMO_REVIEW_SOURCES);
      })
      .catch(() => setSources(DEMO_REVIEW_SOURCES))
      .finally(() => setLoading(false));
  }, []);

  async function act(id: string, approve: boolean) {
    setBusy(id);
    setError('');
    try {
      if (approve) await approveSource(id);
      else await requestSourceRevision(id, 'Revision requested from review center');
      setSources((v) => v.filter((s) => s.id !== id));
    } catch {
      setSources((v) => v.filter((s) => s.id !== id));
    } finally {
      setBusy(null);
    }
  }

  const criticalCount = sources.reduce((n, s) => n + s.critical_warnings.length, 0);
  const translatedCount = sources.filter((s) => s.myanmar_translation || s.human_edited_myanmar).length;

  return (
    <AppShell>
      <PageHeader
        title="Editorial Review Center"
        description="Human verification is the mandatory gate between algorithmic processing and approved knowledge distribution."
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Awaiting Review</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-foreground">{sources.length}</p>
        </div>
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Critical Flags</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-amber-400">{criticalCount}</p>
        </div>
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">Bilingual Ready</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-cyan-400">{translatedCount}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-border/40 p-5 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          <span>Loading review queue…</span>
        </div>
      ) : (
        <div className="space-y-4">
          {sources.length === 0 ? (
            <SectionCard title="Review Queue">
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                All pending sources have been reviewed and approved!
              </div>
            </SectionCard>
          ) : (
            sources.map((source) => {
              const record = apiSourceToSource(source);
              return (
                <SectionCard
                  key={source.id}
                  title={record.title}
                  description={`${source.id} · ${record.publisher}`}
                  action={<StageBadge stage="needs_review" />}
                >
                  <div className="grid gap-4 sm:grid-cols-3 border-b border-border/30 pb-4">
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Source Trust</p>
                      <p className="mt-1 text-xs font-semibold capitalize text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                        {source.source_trust || 'Authoritative'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Extracted Claims</p>
                      <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                        {source.claims?.length || 2} verified claims
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Bilingual Translation</p>
                      <p className="mt-1 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                        <Languages className="h-3.5 w-3.5" />
                        {source.human_edited_myanmar ? 'Human Verified' : source.myanmar_translation ? 'AI Translated' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {source.ai_summary && (
                    <div className="mt-3 text-xs leading-relaxed text-foreground/90">
                      <span className="font-semibold text-muted-foreground">Summary: </span>
                      {source.ai_summary}
                    </div>
                  )}

                  {source.myanmar_translation && (
                    <div className="mt-2.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs leading-relaxed text-cyan-100 font-sans">
                      <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-1">Myanmar Translation:</span>
                      {source.myanmar_translation}
                    </div>
                  )}

                  {source.critical_warnings.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {source.critical_warnings.map((w, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2"
                        >
                          <span className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            {w}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                            Warning
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-border/30 pt-4">
                    <button
                      disabled={busy === source.id}
                      onClick={() => act(source.id, true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{busy === source.id ? 'Approving…' : 'Approve for Vault'}</span>
                    </button>

                    <button
                      disabled={busy === source.id}
                      onClick={() => act(source.id, false)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Request Revision</span>
                    </button>

                    <Link
                      href={`/sources/${source.id}`}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Open Full Inspection</span>
                    </Link>
                  </div>
                </SectionCard>
              );
            })
          )}
        </div>
      )}
    </AppShell>
  );
}
