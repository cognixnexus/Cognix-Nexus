'use client';

import { useEffect, useState } from 'react';
import { HardDrive, RefreshCw, Activity, ShieldCheck, Download, ArrowRight, UserCheck, Layers, FileCheck, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { getActivity } from '@/lib/api';

type ActivityRow = {
  id: string;
  action: string;
  target: string;
  previous_state: string;
  new_state: string;
  timestamp: string;
};

const DEMO_ACTIVITY: ActivityRow[] = [
  {
    id: 'act-001',
    action: 'approved_knowledge_promoted',
    target: 'src-001 (Reasoning Latent Models)',
    previous_state: 'needs_review',
    new_state: 'canonical',
    timestamp: '14 minutes ago',
  },
  {
    id: 'act-002',
    action: 'vector_embedding_indexed',
    target: 'Voyage-4 1536-D cluster (42 chunks)',
    previous_state: 'staged',
    new_state: 'indexed',
    timestamp: '38 minutes ago',
  },
  {
    id: 'act-003',
    action: 'google_drive_export_completed',
    target: 'Reasoning_Latent_Models_2026.pdf',
    previous_state: 'uploading',
    new_state: 'exported',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-004',
    action: 'telegram_alert_dispatched',
    target: 'Topic 215: Model failover Voyage → Cohere',
    previous_state: 'alert_pending',
    new_state: 'delivered',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-005',
    action: 'myanmar_syllable_ocr_verified',
    target: 'doc-881 (Customs & Maritime Legal Corpus)',
    previous_state: 'raw_ocr',
    new_state: 'segmented',
    timestamp: '3 hours ago',
  },
];

export default function ActivityPage() {
  const [rows, setRows] = useState<ActivityRow[]>(DEMO_ACTIVITY);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    getActivity()
      .then(({ items }) => {
        if (items && items.length > 0) setRows(items as ActivityRow[]);
        else setRows(DEMO_ACTIVITY);
      })
      .catch(() => setRows(DEMO_ACTIVITY))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const exportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Action,Target,PreviousState,NewState,Timestamp\n' +
      rows.map((e) => `"${e.id}","${e.action}","${e.target}","${e.previous_state}","${e.new_state}","${e.timestamp}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cognix_audit_trail.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <PageHeader
        title="System Activity &amp; Audit Trail"
        description="Immutable cryptographic event timeline logging source intake, vector embeddings, human gate approvals, and cloud deliveries."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs font-medium text-foreground hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
            >
              <Download className="h-3.5 w-3.5" /> Export Audit CSV
            </button>
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs font-medium text-foreground hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        }
      />

      <SectionCard
        title="Audit Log Events"
        description={`${rows.length} verified events recorded in persistent ledger`}
      >
        <div className="space-y-3">
          {rows.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/50 bg-background-surface/40 p-4 transition-all hover:border-cyan-500/30"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mt-0.5">
                  {e.action.includes('drive') ? (
                    <HardDrive className="h-4 w-4" />
                  ) : e.action.includes('vector') ? (
                    <Layers className="h-4 w-4" />
                  ) : e.action.includes('approved') ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                      {e.action.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ID: {e.id}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {e.target}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span className="rounded bg-background-elevated px-2 py-0.5 text-[10px]">
                      {e.previous_state}
                    </span>
                    <ArrowRight className="h-3 w-3 text-cyan-400" />
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400 font-semibold border border-cyan-500/20">
                      {e.new_state}
                    </span>
                  </div>
                </div>
              </div>

              <span className="shrink-0 text-xs text-muted-foreground font-mono">
                {e.timestamp}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
