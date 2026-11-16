'use client';

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Key,
  Copy,
  Check,
  TrendingUp,
  HardDrive,
  FileText,
  Search,
  Zap,
  Layers,
  Send,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ApiCredential {
  name: string;
  provider: string;
  maskedKey: string;
  fullKeyPreview: string;
  status: 'Active' | 'Standby' | 'Degraded';
  lastPing: string;
}

const CREDENTIALS: ApiCredential[] = [
  {
    name: 'GEMINI_API_KEY',
    provider: 'Google AI Studio (Gemini 2.5 Pro / Flash Distiller)',
    maskedKey: 'AIzaSy••••••••8819',
    fullKeyPreview: 'AIzaSy••••••••8819',
    status: 'Active',
    lastPing: '2 mins ago',
  },
  {
    name: 'VOYAGE_API_KEY',
    provider: 'Voyage AI (voyage-4 1536-dim Second Brain)',
    maskedKey: 'pa-Cyv••••••••riL',
    fullKeyPreview: 'pa-Cyv••••••••riL',
    status: 'Active',
    lastPing: '14 mins ago',
  },
  {
    name: 'QDRANT_API_KEY',
    provider: 'Qdrant Cloud (Vector Knowledge Base Index)',
    maskedKey: 'eyJhb••••••••4b',
    fullKeyPreview: 'eyJhb••••••••4b',
    status: 'Active',
    lastPing: 'Just now',
  },
  {
    name: 'OPENROUTER_API_KEY',
    provider: 'OpenRouter Fallback (Secondary LLM Gateway)',
    maskedKey: 'sk-or-••••••••95f',
    fullKeyPreview: 'sk-or-••••••••95f',
    status: 'Standby',
    lastPing: '1 day ago',
  },
  {
    name: 'COHERE_API_KEY',
    provider: 'Cohere (embed-v4.0 Multi-lingual Fallback)',
    maskedKey: 'cohere_••••••••Kj',
    fullKeyPreview: 'cohere_••••••••Kj',
    status: 'Active',
    lastPing: '25 mins ago',
  },
  {
    name: 'SENTRY_DSN',
    provider: 'Sentry Performance & Agent Telemetry',
    maskedKey: 'https://••••@o4512.ingest.sentry.io/4512',
    fullKeyPreview: 'https://••••@o4512.ingest.sentry.io/4512',
    status: 'Active',
    lastPing: '1 min ago',
  },
];

interface ErrorIncident {
  id: string;
  time: string;
  nodeId: string;
  service: string;
  event: string;
  severity: 'Warning' | 'Resolved' | 'Info';
}

const INCIDENTS: ErrorIncident[] = [
  {
    id: 'inc-204',
    time: '15:12:44',
    nodeId: 'NODE-AI-902',
    service: 'Gemini 2.5 Pro',
    event: 'Long paper payload (82k tokens) distilled in 4.2s without truncation',
    severity: 'Resolved',
  },
  {
    id: 'inc-203',
    time: '13:40:19',
    nodeId: 'NODE-VEC-811',
    service: 'Qdrant Cloud',
    event: 'HNSW index synchronized: 1,420 vector nodes updated',
    severity: 'Info',
  },
  {
    id: 'inc-202',
    time: '11:15:02',
    nodeId: 'NODE-TG-740',
    service: 'Telegram Gate',
    event: 'Rate limiter queued morning briefing (0.8s backoff applied)',
    severity: 'Warning',
  },
  {
    id: 'inc-201',
    time: '07:30:00',
    nodeId: 'NODE-CRON-600',
    service: 'Level Up 20 Engine',
    event: 'Daily SM-2 spaced repetition deck generated: 18 flashcards due',
    severity: 'Resolved',
  },
];

export default function UsagePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = (name: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(name);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Usage & Multi-Model Telemetry Hub
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Live metering of Gemini 2.5, Voyage AI, Qdrant Vector DB, OpenRouter, and Sentry failover
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 self-start rounded-xl border-border bg-background-elevated text-xs text-foreground hover:bg-muted/40 sm:self-auto"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </Button>
        </div>

        {/* 3 Primary KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border border-border/60 bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Agent Invocations
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">4,620</span>
                <span className="text-xs font-semibold text-emerald-400">+21.4%</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Across multi-agent swarm & second brain this week</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Token Consumption & Burn
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">2,840,000</span>
                <span className="text-xs text-muted-foreground">/ 10M quota</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-background-elevated overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: '28.4%' }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">28.4% consumed · 7,160,000 tokens remaining</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  System Error Rate
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-emerald-400">0.04%</span>
                <span className="text-xs font-medium text-emerald-300">Healthy</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">All 6 failover chains responding within SLA</p>
            </CardContent>
          </Card>
        </div>

        {/* API Credentials & Provider Status */}
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-white">API Credentials & Provider Status</h2>
            </div>
            <span className="rounded-lg bg-background-elevated px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              5 of 6 Active
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Variable Name</th>
                  <th className="pb-3">Service & Role</th>
                  <th className="pb-3">Masked Secret</th>
                  <th className="pb-3">Health Status</th>
                  <th className="pb-3 pr-2 text-right">Last Invocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-mono">
                {CREDENTIALS.map(cred => (
                  <tr key={cred.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-primary">{cred.name}</td>
                    <td className="py-3.5 font-sans text-foreground">{cred.provider}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{cred.maskedKey}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(cred.name, cred.fullKeyPreview)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-white"
                          title="Copy masked key"
                        >
                          {copiedKey === cred.name ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge
                        className={`text-[10px] font-sans font-semibold ${
                          cred.status === 'Active'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {cred.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 pr-2 text-right font-sans text-muted-foreground">{cred.lastPing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Custom Data Visualizations */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Chart 1: 7-Day Multi-Agent Activity Volume Curve */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  7-Day Multi-Agent Activity & Distillation Volume
                </h3>
              </div>
              <span className="text-xs text-primary font-medium">Total: 4,620 calls</span>
            </div>

            <div className="mt-5 h-48 w-full">
              <svg viewBox="0 0 600 160" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="cognixCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                {/* Area fill */}
                <polygon
                  points="30,120 110,95 190,110 270,60 350,75 430,35 530,25 530,140 30,140"
                  fill="url(#cognixCurveGrad)"
                />

                {/* Smooth curve */}
                <polyline
                  points="30,120 110,95 190,110 270,60 350,75 430,35 530,25"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {[
                  { x: 30, y: 120, val: '380' },
                  { x: 110, y: 95, val: '510' },
                  { x: 190, y: 110, val: '460' },
                  { x: 270, y: 60, val: '720' },
                  { x: 350, y: 75, val: '640' },
                  { x: 430, y: 35, val: '930' },
                  { x: 530, y: 25, val: '980' },
                ].map(pt => (
                  <g key={pt.x}>
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#06b6d4" stroke="#060910" strokeWidth="2" />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {pt.val}
                    </text>
                  </g>
                ))}

                {/* X axis labels */}
                {[
                  { x: 30, day: 'Mon' },
                  { x: 110, day: 'Tue' },
                  { x: 190, day: 'Wed' },
                  { x: 270, day: 'Thu' },
                  { x: 350, day: 'Fri' },
                  { x: 430, day: 'Sat' },
                  { x: 530, day: 'Sun' },
                ].map(lbl => (
                  <text
                    key={lbl.day}
                    x={lbl.x}
                    y="155"
                    fill="#64748b"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {lbl.day}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Chart 2: Model Failover & Token Share */}
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Model Provider & Token Share
              </h3>
              <span className="text-xs text-primary font-medium">Failover Weighted</span>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { label: 'Gemini 2.5 Pro (Primary Distiller)', tokens: '1,647k tok', pct: 58, color: 'bg-primary' },
                { label: 'Voyage AI (1536-D Vectorization)', tokens: '681k tok', pct: 24, color: 'bg-cyan-500' },
                { label: 'OpenRouter (Fallback Gateway)', tokens: '340k tok', pct: 12, color: 'bg-blue-500' },
                { label: 'Cohere (embed-v4.0 Secondary)', tokens: '172k tok', pct: 6, color: 'bg-emerald-500' },
              ].map(item => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">{item.label}</span>
                    <span className="font-mono text-muted-foreground">
                      {item.tokens} ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background-elevated overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Realtime Sentry Exception & Failover Telemetry Tracker */}
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">System Error & Agent Failover Tracker</h2>
            </div>
            <span className="text-xs text-muted-foreground">Realtime Sentry Feed</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/40 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Timestamp</th>
                  <th className="pb-3">Incident / Resolution</th>
                  <th className="pb-3">Node ID</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3 pr-2 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-mono">
                {INCIDENTS.map(inc => (
                  <tr key={inc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pl-2 text-muted-foreground">{inc.time}</td>
                    <td className="py-3 font-sans text-foreground font-medium">{inc.event}</td>
                    <td className="py-3 text-primary">{inc.nodeId}</td>
                    <td className="py-3 font-sans text-muted-foreground">{inc.service}</td>
                    <td className="py-3 pr-2 text-right font-sans">
                      <Badge
                        className={`text-[10px] font-semibold ${
                          inc.severity === 'Resolved'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                            : inc.severity === 'Warning'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                            : 'border-primary/30 bg-primary/10 text-primary'
                        }`}
                      >
                        {inc.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
