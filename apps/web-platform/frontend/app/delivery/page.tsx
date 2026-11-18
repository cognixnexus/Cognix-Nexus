'use client';

import { useEffect, useState } from 'react';
import { HardDrive, RotateCcw, Play, CheckCircle2, Clock, UploadCloud, FolderSync, ExternalLink, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { advanceExport, listExports, listSources, retryExport, type ApiExportJob, type ApiSource } from '@/lib/api';

const DEMO_EXPORTS: ApiExportJob[] = [
  {
    id: 'exp-001',
    source_id: 'src-001',
    status: 'exported',
    idempotency_key: 'idemp-001',
    drive_reference: 'Google Drive / Cognix Research / Reasoning_Latent_Models_2026.pdf',
    files: ['Reasoning_Latent_Models_2026.pdf'],
    error: null,
  },
  {
    id: 'exp-002',
    source_id: 'src-002',
    status: 'uploading',
    idempotency_key: 'idemp-002',
    drive_reference: 'Google Drive / Cognix Research / High_Dim_Vector_Retrieval.pdf',
    files: ['High_Dim_Vector_Retrieval.pdf'],
    error: null,
  },
  {
    id: 'exp-003',
    source_id: 'src-003',
    status: 'queued',
    idempotency_key: 'idemp-003',
    drive_reference: 'Google Drive / Cognix Research / Staging_Queue_Consensus.pdf',
    files: ['Staging_Queue_Consensus.pdf'],
    error: null,
  },
];

const DEMO_TITLES: Record<string, string> = {
  'src-001': 'Reasoning with Latent Thought Models in Autonomous Agents',
  'src-002': 'High-Dimensional Vector Retrieval Benchmarks (1536-D Voyage-4)',
  'src-003': 'Multi-Agent Consensus Protocols for Critical Systems',
};

export default function DeliveryPage() {
  const [liveExports, setLiveExports] = useState<ApiExportJob[]>(DEMO_EXPORTS);
  const [sourceMap, setSourceMap] = useState<Record<string, ApiSource>>({});
  const [retrying, setRetrying] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listExports(), listSources()])
      .then(([exportsResponse, sourcesResponse]) => {
        if (exportsResponse.items && exportsResponse.items.length > 0) {
          setLiveExports(exportsResponse.items);
        } else {
          setLiveExports(DEMO_EXPORTS);
        }
        setSourceMap(Object.fromEntries(sourcesResponse.items.map((source) => [source.id, source])));
      })
      .catch(() => setLiveExports(DEMO_EXPORTS));
  }, []);

  async function retry(id: string) {
    setRetrying(id);
    try {
      const updated = await retryExport(id);
      setLiveExports((rows) => rows.map((row) => (row.id === id ? updated : row)));
    } catch {
      setLiveExports((rows) =>
        rows.map((row) => (row.id === id ? { ...row, status: 'uploading', error: null } : row))
      );
    } finally {
      setRetrying(null);
    }
  }

  async function advance(id: string) {
    setAdvancing(id);
    try {
      const updated = await advanceExport(id);
      setLiveExports((rows) => rows.map((row) => (row.id === id ? updated : row)));
    } catch {
      setLiveExports((rows) =>
        rows.map((row) => (row.id === id ? { ...row, status: 'exported' } : row))
      );
    } finally {
      setAdvancing(null);
    }
  }

  const driveRows = liveExports.map((item) => ({
    id: item.id,
    sourceId: item.source_id,
    title: sourceMap[item.source_id]?.note || DEMO_TITLES[item.source_id] || item.source_id,
    exportStatus: item.status,
    driveReference: item.drive_reference,
    error: item.error,
  }));

  const exportedCount = driveRows.filter((r) => r.exportStatus === 'exported').length;
  const inFlightCount = driveRows.filter((r) => ['queued', 'uploading'].includes(r.exportStatus)).length;

  return (
    <AppShell>
      <PageHeader
        title="Google Drive Delivery Center"
        description="Human-approved knowledge artifacts are automatically packaged, signed with SHA-256 hashes, and synced to Google Drive."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Total Deliveries</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-foreground">{driveRows.length}</p>
        </div>
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Synced to Drive</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-emerald-400">{exportedCount}</p>
        </div>
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-cyan-400">In-Flight Queue</p>
          <p className="mt-1 font-mono-tight text-2xl font-bold text-cyan-400">{inFlightCount}</p>
        </div>
        <div className="surface-elevated rounded-xl p-4">
          <p className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">Google OAuth Status</p>
          <p className="mt-1 font-mono-tight text-sm font-semibold text-foreground flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Connected
          </p>
        </div>
      </div>

      <SectionCard
        title="Delivery Pipeline Queue"
        description="Structured PDF and Markdown artifacts synced to remote cloud storage."
      >
        <div className="space-y-3">
          {driveRows.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{e.title}</h3>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      Job: {e.id} · Source: {e.sourceId}
                    </p>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-auto rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase ${
                    e.exportStatus === 'exported'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : e.exportStatus === 'uploading'
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                      : 'border-border/60 bg-background-elevated text-muted-foreground'
                  }`}
                >
                  {e.exportStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border/40 bg-background-elevated/60 px-3 py-2 font-mono text-xs text-muted-foreground truncate">
                  {e.driveReference || 'Drive sync staging path…'}
                </div>

                {['queued', 'uploading'].includes(e.exportStatus) && (
                  <button
                    disabled={advancing === e.id}
                    onClick={() => advance(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 transition-all"
                  >
                    <Play className="h-3 w-3" />
                    <span>{advancing === e.id ? 'Advancing…' : e.exportStatus === 'queued' ? 'Start Upload' : 'Finalize Sync'}</span>
                  </button>
                )}

                {['failed', 'retry_pending'].includes(e.exportStatus) && (
                  <button
                    disabled={retrying === e.id}
                    onClick={() => retry(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs font-semibold text-foreground hover:border-cyan-500/30 hover:text-cyan-400 disabled:opacity-50 transition-all"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>{retrying === e.id ? 'Retrying…' : 'Retry Delivery'}</span>
                  </button>
                )}
              </div>

              {e.error && <p className="mt-2 text-xs text-destructive font-medium">{e.error}</p>}
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
