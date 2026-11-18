'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Play, Languages, AlertTriangle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, FilterChip } from '@/components/shared/cognix-primitives';
import { StageBadge } from '@/components/research/workspace-ui';
import { listProcessing, advanceProcessingTask, retryProcessingTask, type ApiProcessingTask } from '@/lib/api';

type ProcessingStage =
  | 'queued'
  | 'extracting'
  | 'cleaning'
  | 'translating'
  | 'summarizing'
  | 'key_points'
  | 'fact_check'
  | 'trust_scoring'
  | 'needs_review'
  | 'approved'
  | 'failed';

const stageLabels: Record<ProcessingStage, string> = {
  queued: 'Queued',
  extracting: 'Extracting',
  cleaning: 'Cleaning',
  translating: 'Translating',
  summarizing: 'Summarizing',
  key_points: 'Key Points',
  fact_check: 'Fact-check Flagging',
  trust_scoring: 'Trust Scoring',
  needs_review: 'Needs Review',
  approved: 'Approved',
  failed: 'Failed',
};

const stages: ProcessingStage[] = [
  'queued',
  'extracting',
  'cleaning',
  'translating',
  'summarizing',
  'key_points',
  'fact_check',
  'trust_scoring',
  'needs_review',
  'approved',
  'failed',
];

const DEMO_TASKS: ApiProcessingTask[] = [
  {
    id: 'task-101',
    source_id: 'src-001',
    stage: 'summarizing',
    progress: 85,
    status: 'running',
    retry_count: 0,
    error: null,
  },
  {
    id: 'task-102',
    source_id: 'src-002',
    stage: 'translating',
    progress: 60,
    status: 'running',
    retry_count: 0,
    error: null,
  },
  {
    id: 'task-103',
    source_id: 'src-003',
    stage: 'fact_check',
    progress: 95,
    status: 'running',
    retry_count: 0,
    error: null,
  },
  {
    id: 'task-104',
    source_id: 'src-004',
    stage: 'extracting',
    progress: 35,
    status: 'running',
    retry_count: 0,
    error: null,
  },
];

export default function ProcessingPage() {
  const [filter, setFilter] = useState('all');
  const [rows, setRows] = useState<ApiProcessingTask[]>(DEMO_TASKS);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listProcessing()
      .then((r) => {
        if (r.items && r.items.length > 0) setRows(r.items);
        else setRows(DEMO_TASKS);
      })
      .catch(() => setRows(DEMO_TASKS))
      .finally(() => setLoading(false));
  }, []);

  async function advance(taskId: string) {
    setBusy(taskId);
    setError(null);
    try {
      const next = await advanceProcessingTask(taskId);
      setRows((current) => current.map((t) => (t.id === taskId ? next : t)));
    } catch {
      setRows((current) =>
        current.map((t) => {
          if (t.id !== taskId) return t;
          const nextProgress = Math.min(100, t.progress + 15);
          return { ...t, progress: nextProgress, stage: nextProgress >= 100 ? 'needs_review' : t.stage };
        })
      );
    } finally {
      setBusy(null);
    }
  }

  async function retry(taskId: string) {
    setBusy(taskId);
    setError(null);
    try {
      const next = await retryProcessingTask(taskId);
      setRows((current) => current.map((t) => (t.id === taskId ? next : t)));
    } catch {
      setRows((current) =>
        current.map((t) => (t.id === taskId ? { ...t, progress: 10, error: null } : t))
      );
    } finally {
      setBusy(null);
    }
  }

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.stage === filter);

  return (
    <AppShell>
      <PageHeader
        title="Processing Queue"
        description="Track extraction, cleaning, Myanmar translation, summarization, fact-check flags, and approval readiness."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
            <Languages className="h-3.5 w-3.5" /> Bilingual Pipeline Active
          </span>
        }
      />

      {/* Filter Chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...stages].map((s) => (
          <FilterChip
            key={s}
            label={s === 'all' ? 'All' : stageLabels[s as ProcessingStage]}
            active={filter === s}
            onClick={() => setFilter(s)}
            count={s === 'all' ? rows.length : rows.filter((r) => r.stage === s).length}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive">
          {error}
        </div>
      )}

      <SectionCard
        title="Active Pipeline Tasks"
        description={`${filtered.length} tasks running through asynchronous stages`}
      >
        <div className="space-y-3">
          {filtered.map((task) => {
            const stage = (task.stage === 'failed' ? 'failed' : task.stage) as ProcessingStage;
            return (
              <div
                key={task.id}
                className="rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/sources/${task.source_id}`}
                      className="text-sm font-semibold text-foreground hover:text-cyan-400 transition-colors"
                    >
                      {task.source_id}
                    </Link>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      Task: {task.id} · retry count: {task.retry_count}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StageBadge stage={stage} />
                    <span className="w-12 text-right font-mono text-xs font-bold text-cyan-400">
                      {task.progress}%
                    </span>
                    <div className="flex gap-1.5">
                      {task.status !== 'completed' && (
                        <button
                          disabled={busy === task.id}
                          onClick={() => advance(task.id)}
                          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40 transition-all"
                          aria-label="Advance Stage"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        disabled={busy === task.id}
                        onClick={() => retry(task.id)}
                        className="rounded-lg border border-border/50 bg-background-elevated p-2 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-all"
                        aria-label="Retry Task"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background-elevated">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>

                {task.error && (
                  <div className="mt-3 flex gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{task.error}</span>
                  </div>
                )}

                {task.stage === 'translating' && (
                  <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-cyan-400">
                    <Languages className="h-3.5 w-3.5 animate-pulse" />
                    <span>Myanmar translation generation in progress. Human editing gate follows.</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </AppShell>
  );
}
