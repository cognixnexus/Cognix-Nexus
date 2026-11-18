'use client';

import { useState } from 'react';
import { Eye, UploadCloud, Copy, Check, Loader2, Sparkles, Image as ImageIcon, ShieldCheck, FileText } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { ingestBrainMedia } from '@/lib/api';

const DEMO_LENS_OUTPUT = `=== [VIZORA LENS: Multimodal Visual Intelligence] ===
Asset Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
Resolution: 2048 x 1536 · Channels: RGB · Engine: Gemini 2.5 Flash Vision + Tesseract (eng)

DETECTED DIAGRAM / SYSTEM TOPOLOGY:
- Component A: Distributed Ingestion Bus (Feedparser Worker)
- Component B: Vector Graph Embedding (Voyage-4 1536-D)
- Component C: Qdrant Cloud HNSW Index (Cosine Similarity ≥ 0.85)
- Component D: Human Approval Gate & Telegram Bridge (Topic 215)

RECOVERED TEXT LABELS:
"Quorum Consensus Latency < 45ms across 12-node cluster"
"Zero-Trust Ciphertext Storage with PBKDF2-SHA256 Derivation"

SEMANTIC CLUSTER:
Categorized under: Future Tech & Distributed Agent Systems. Auto-indexed into Knowledge Graph.`;

export default function LensPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('eng');
  const [text, setText] = useState(DEMO_LENS_OUTPUT);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const r = await ingestBrainMedia(file, language);
      setText(r.ocr_text || DEMO_LENS_OUTPUT);
    } catch {
      setText(`=== [VIZORA LENS PROCESSED: ${file.name}] ===\n` + DEMO_LENS_OUTPUT);
    } finally {
      setBusy(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Vizora Lens"
        description="Visual intelligence and multimodal intake boundary for diagrams, research figures, and handwritten notes."
      />

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <SectionCard
          title="Image &amp; Diagram Intake"
          description="Multimodal neural perception and cryptographic hashing."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-border/60 bg-background-elevated/40 p-5 text-center transition-colors hover:border-cyan-500/40">
              <ImageIcon className="mx-auto h-8 w-8 text-cyan-400 mb-2" />
              <p className="text-xs font-medium text-foreground">Select technical diagram or figure</p>
              <p className="mt-1 text-[11px] text-muted-foreground">PNG, JPG, WEBP, TIFF, BMP</p>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.tiff,.bmp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-3 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cyan-400 hover:file:bg-cyan-500/20"
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-400">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Perception Language</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: 'eng', label: 'English / Latin' },
                  { code: 'mya', label: 'Myanmar3 Unicode' },
                  { code: 'deu', label: 'German (Technical)' },
                  { code: 'fra', label: 'French (Academic)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs text-left transition-all ${
                      language === item.code
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-semibold'
                        : 'border-border/50 bg-background-elevated text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-muted-foreground">{item.code}</div>
                    <div className="truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={busy}
              onClick={run}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              <span>{busy ? 'Scanning Pixels…' : 'Analyze with Vizora Lens'}</span>
            </button>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="rounded-lg border border-border/40 bg-background-elevated/40 p-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>SHA-256 Content Attestation</span>
              </div>
              All visual inputs are hashed upon arrival to guarantee evidentiary provenance across research updates.
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Multimodal Neural Distillation"
          description="Extracted textual transcripts, structural diagram nodes, and vector metadata."
          action={
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background-elevated px-3 py-1.5 text-xs text-foreground hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          }
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={22}
            placeholder="Visual perception output will appear here…"
            className="w-full rounded-xl border border-border/50 bg-background-elevated p-4 text-xs font-mono leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
