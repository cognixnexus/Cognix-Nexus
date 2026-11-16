'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Brain,
  Sparkles,
  Layers,
  Send,
  Database,
  Cpu,
  Clock,
  Terminal,
  Trash2,
  Workflow,
  Search,
  Network,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export interface StaticStage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  category: 'Ingestion' | 'Planning' | 'RAG' | 'Distill' | 'Embedding' | 'Approval' | 'Memory' | 'Delivery';
  enabled: boolean;
  estimatedLatency: string;
  icon: React.ElementType;
  description: string;
  specs: {
    engine: string;
    throughput: string;
    model: string;
  };
}

const DEFAULT_STAGES: StaticStage[] = [
  {
    id: 'cognix-stage-1',
    stageNumber: 1,
    title: 'Daily Ingestion & ArXiv',
    subtitle: 'Automated Academic & RSS Feeds',
    category: 'Ingestion',
    enabled: true,
    estimatedLatency: '120 ms',
    icon: Clock,
    description: 'Scrapes daily arXiv cs.AI papers, OpenAI research blogs, and user RSS feeds into inbound staging buffer.',
    specs: {
      engine: 'Feedparser + Cheerio Worker',
      throughput: '25 papers / batch',
      model: 'Raw Markdown Parser',
    },
  },
  {
    id: 'cognix-stage-2',
    stageNumber: 2,
    title: 'Goal Decomposition Agent',
    subtitle: 'Research Task & Sub-Goal Planner',
    category: 'Planning',
    enabled: true,
    estimatedLatency: '240 ms',
    icon: Brain,
    description: 'Autonomous planner agent decomposes complex research inquiries into focused search queries and key entities.',
    specs: {
      engine: 'Autonomous Planner V3',
      throughput: 'Sub-second AST Plan',
      model: 'Gemini 2.5 Flash',
    },
  },
  {
    id: 'cognix-stage-3',
    stageNumber: 3,
    title: 'Context Retrieval & RAG',
    subtitle: 'Second Brain Hybrid Search',
    category: 'RAG',
    enabled: true,
    estimatedLatency: '180 ms',
    icon: Search,
    description: 'Retrieves relevant knowledge vault notes and historical research sessions using hybrid dense/sparse vector matching.',
    specs: {
      engine: 'pgvector + Qdrant Cloud',
      throughput: 'Top-20 Chunks in 18ms',
      model: 'Hybrid Inverted Index',
    },
  },
  {
    id: 'cognix-stage-4',
    stageNumber: 4,
    title: 'Gemini 2.5 Knowledge Distiller',
    subtitle: 'Synthesized Insights & Takeaways',
    category: 'Distill',
    enabled: true,
    estimatedLatency: '410 ms',
    icon: Sparkles,
    description: 'Extracts core arguments, 3 critical takeaways, and actionable node definitions for the second brain graph.',
    specs: {
      engine: 'Distiller Pipeline Pro',
      throughput: '1M Token Context',
      model: 'Gemini 2.5 Pro (Bilingual)',
    },
  },
  {
    id: 'cognix-stage-5',
    stageNumber: 5,
    title: 'Qdrant Vector Embedding',
    subtitle: '1536-dim Semantic Vectorization',
    category: 'Embedding',
    enabled: true,
    estimatedLatency: '210 ms',
    icon: Database,
    description: 'Generates normalized dense embeddings using Voyage AI voyage-4 for sub-millisecond similarity recall.',
    specs: {
      engine: 'Qdrant Distributed Cluster',
      throughput: '1536 Dimensions',
      model: 'Voyage AI voyage-4',
    },
  },
  {
    id: 'cognix-stage-6',
    stageNumber: 6,
    title: 'Human-in-the-Loop Review',
    subtitle: 'Telegram Approval & Verification',
    category: 'Approval',
    enabled: false, // Default bypassed
    estimatedLatency: 'Bypassed',
    icon: Send,
    description: 'Interactive verification prompt sent to Telegram Topic #Cognix-Nexus for manual fact-checking and sign-off.',
    specs: {
      engine: 'Telegram Bot API / Topic 6',
      throughput: 'Instant Push Alert',
      model: 'Interactive Inline Callback',
    },
  },
  {
    id: 'cognix-stage-7',
    stageNumber: 7,
    title: 'Auto-Quiz & Memory Matrix',
    subtitle: 'SM-2 Spaced Repetition Cards',
    category: 'Memory',
    enabled: true,
    estimatedLatency: '160 ms',
    icon: Network,
    description: 'Automatically generates 3 conceptual flashcards and links them to the user Level Up 20 daily mastery deck.',
    specs: {
      engine: 'SuperMemo SM-2 Scheduler',
      throughput: '3 Flashcards / Note',
      model: 'Cognitive Matrix V2',
    },
  },
  {
    id: 'cognix-stage-8',
    stageNumber: 8,
    title: 'Telegram Morning Digest',
    subtitle: 'Delivery & Durable Brain Vault Save',
    category: 'Delivery',
    enabled: true,
    estimatedLatency: '290 ms',
    icon: Layers,
    description: 'Saves immutable note in Supabase Vault and broadcasts 07:30 AM audio/text briefing to Telegram mobile app.',
    specs: {
      engine: 'Supabase + Telegram Webhook',
      throughput: 'Zero Loss Persistence',
      model: 'Markdown + TTS Audio Card',
    },
  },
];

interface LogEntry {
  id: string;
  time: string;
  stageName: string;
  message: string;
  type: 'info' | 'success' | 'warn';
}

export default function WorkflowsPage() {
  const [stages, setStages] = useState<StaticStage[]>(DEFAULT_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>('cognix-stage-1');
  const [isRunning, setIsRunning] = useState(false);
  const [activeRunningId, setActiveRunningId] = useState<string | null>(null);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      time: '06:00:00',
      stageName: 'COGNIX-ORCHESTRATOR',
      message: 'Autonomous Second Brain Multi-Agent Pipeline initialized.',
      type: 'info',
    },
    {
      id: 'log-2',
      time: '06:00:01',
      stageName: 'REVIEW GATE',
      message: 'Stage 6 (Human-in-the-Loop Review) is set to BYPASS — direct delivery to Memory Matrix.',
      type: 'warn',
    },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const selectedStage = stages.find(s => s.id === selectedStageId) || stages[0];

  const handleToggleStage = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStages(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const nextState = !s.enabled;
        const logMsg: LogEntry = {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          stageName: s.title.toUpperCase(),
          message: nextState
            ? `Stage activated in pipeline bus.`
            : `Stage DEACTIVATED — auto-bypass arc enabled.`,
          type: nextState ? 'info' : 'warn',
        };
        setLogs(l => [...l, logMsg]);
        return {
          ...s,
          enabled: nextState,
          estimatedLatency: nextState ? (s.id === 'cognix-stage-6' ? '350 ms' : s.estimatedLatency) : 'Bypassed',
        };
      })
    );
  };

  const handleResetDefaults = () => {
    setStages(DEFAULT_STAGES);
    setCompletedStageIds([]);
    setActiveRunningId(null);
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        stageName: 'PIPELINE CONFIG',
        message: 'Pipeline restored to recommended Cognix Second Brain configuration.',
        type: 'info',
      },
    ]);
  };

  const handleRunSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompletedStageIds([]);
    setActiveRunningId(null);

    const activeStages = stages.filter(s => s.enabled);
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        stageName: 'SIMULATOR',
        message: `Starting automated run for paper "Reasoning_With_Latent_Thought_Models.pdf" (${activeStages.length} active stages)...`,
        type: 'info',
      },
    ]);

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (!stage.enabled) {
        setLogs(prev => [
          ...prev,
          {
            id: `log-${Date.now()}-${i}`,
            time: new Date().toLocaleTimeString(),
            stageName: stage.title.toUpperCase(),
            message: `[BYPASS] Stage ${stage.stageNumber} disabled — auto-routing around node.`,
            type: 'warn',
          },
        ]);
        continue;
      }

      setActiveRunningId(stage.id);
      setSelectedStageId(stage.id);
      setLogs(prev => [
        ...prev,
        {
          id: `log-${Date.now()}-${i}`,
          time: new Date().toLocaleTimeString(),
          stageName: stage.title.toUpperCase(),
          message: `Executing stage [${stage.stageNumber}/8]: ${stage.subtitle}...`,
          type: 'info',
        },
      ]);

      await new Promise(r => setTimeout(r, 650));

      setCompletedStageIds(prev => [...prev, stage.id]);
      setLogs(prev => [
        ...prev,
        {
          id: `log-done-${Date.now()}-${i}`,
          time: new Date().toLocaleTimeString(),
          stageName: stage.title.toUpperCase(),
          message: `Stage ${stage.stageNumber} completed successfully (telemetry verified).`,
          type: 'success',
        },
      ]);
    }

    setActiveRunningId(null);
    setIsRunning(false);
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-finish`,
        time: new Date().toLocaleTimeString(),
        stageName: 'SIMULATOR',
        message: 'Pipeline execution complete. Flashcards added to Level Up 20 & morning digest queued.',
        type: 'success',
      },
    ]);
  };

  const activeCount = stages.filter(s => s.enabled).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 lg:flex-row lg:items-center lg:justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Agent Workflows & Knowledge Pipeline
              </h1>
              <Badge className="border-primary/30 bg-primary/10 text-primary">
                Multi-Agent Static Engine
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeCount} of {stages.length} stages active · Auto-bypass routing enabled · Zero knowledge leakage
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              disabled={isRunning}
              className="h-9 rounded-xl border-border bg-background-elevated text-xs text-foreground hover:bg-muted/40"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Defaults
            </Button>
            <Button
              size="sm"
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="h-9 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-90"
            >
              <Play className={`mr-1.5 h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Processing...' : 'Run Pipeline Simulation'}
            </Button>
          </div>
        </div>

        {/* Main Grid: Pipeline Canvas & Telemetry Log */}
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Left: 8-Stage Visual Pipeline */}
          <div className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>Pre-configured Multi-Agent Flow: Toggle any stage to bypass it. Pipeline auto-routes around disabled agents.</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] shrink-0 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Active
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Bypassed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {stages.map(stage => {
                const isSelected = selectedStageId === stage.id;
                const isRunningThis = activeRunningId === stage.id;
                const isCompleted = completedStageIds.includes(stage.id);
                const StageIcon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-150 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,229,255,0.18)]'
                        : stage.enabled
                        ? 'border-border/60 bg-card hover:border-primary/40 hover:bg-card/90'
                        : 'border-border/40 bg-background-surface opacity-60 hover:opacity-80'
                    }`}
                  >
                    {/* Top Bar: Stage Number & Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-background-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Stage {stage.stageNumber}
                      </span>
                      <Switch
                        checked={stage.enabled}
                        onCheckedChange={() => handleToggleStage(stage.id)}
                        onClick={e => e.stopPropagation()}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {/* Stage Icon & Title */}
                    <div className="mt-3 flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isRunningThis
                            ? 'animate-pulse bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : stage.enabled
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <StageIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{stage.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{stage.subtitle}</p>
                      </div>
                    </div>

                    {/* Bottom Metrics & Status */}
                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px]">
                      {stage.enabled ? (
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          )}
                          <span>{isCompleted ? 'Passed' : 'Ready'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Bypassed</span>
                        </span>
                      )}
                      <span className="font-mono text-muted-foreground">{stage.estimatedLatency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Node Inspector Panel */}
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <selectedStage.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Stage {selectedStage.stageNumber}: {selectedStage.title}
                      </h3>
                      <Badge
                        className={
                          selectedStage.enabled
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]'
                        }
                      >
                        {selectedStage.enabled ? 'Active In Swarm' : 'Bypassed'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedStage.subtitle}</p>
                  </div>
                </div>

                <Button
                  variant={selectedStage.enabled ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => handleToggleStage(selectedStage.id)}
                  className={`h-9 rounded-xl text-xs font-semibold ${
                    selectedStage.enabled
                      ? 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {selectedStage.enabled ? 'Deactivate (Bypass)' : 'Activate Stage'}
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border/40 bg-background-surface p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AGENT ENGINE & PURPOSE</p>
                  <p className="mt-1.5 text-xs font-semibold text-foreground">{selectedStage.specs.engine}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{selectedStage.description}</p>
                </div>

                <div className="rounded-xl border border-border/40 bg-background-surface p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">MODEL & LATENCY</p>
                  <p className="mt-1.5 text-xs font-semibold text-primary">{selectedStage.specs.model}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Estimated Latency: <span className="font-mono text-foreground">{selectedStage.estimatedLatency}</span>
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 bg-background-surface p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">THROUGHPUT & ROUTING</p>
                  <p className="mt-1.5 text-xs font-semibold text-emerald-400">{selectedStage.specs.throughput}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Routing State:{' '}
                    <span className="font-semibold text-foreground">
                      {selectedStage.enabled ? 'Direct Execution' : 'Auto-Bypass Enabled'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Telemetry Log Terminal */}
          <div className="flex flex-col rounded-2xl border border-border/60 bg-background-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-card">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-white">Pipeline Telemetry Log</span>
              </div>
              <span className="rounded-md bg-background-elevated px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {logs.length} entries
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] max-h-[580px]">
              {logs.map(log => (
                <div key={log.id} className="leading-relaxed">
                  <span className="text-muted-foreground mr-2">{log.time}</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : log.type === 'warn'
                        ? 'text-amber-400 font-semibold'
                        : 'text-primary font-semibold'
                    }
                  >
                    [{log.stageName}]
                  </span>{' '}
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            <div className="border-t border-border/40 p-2.5 flex items-center justify-between bg-card">
              <span className="text-[10px] text-muted-foreground">
                Status: <span className="text-emerald-400 font-medium">{isRunning ? 'Running' : 'Idle'}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLogs([])}
                className="h-7 text-[10px] text-muted-foreground hover:text-white"
              >
                <Trash2 className="mr-1 h-3 w-3" /> Clear Log
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
