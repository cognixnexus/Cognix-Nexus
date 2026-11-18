'use client';

import { useEffect, useState } from 'react';
import { Brain, Plus, Sparkles, CheckCircle2, RotateCcw, Award, Layers, Volume2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader, SectionCard, GlowButton } from '@/components/shared/cognix-primitives';
import { ApiLanguageCard, createLanguageCard, getDueLanguageCards, reviewLanguageCard } from '@/lib/api';

const DEMO_CARDS: ApiLanguageCard[] = [
  {
    id: 'card-1',
    language: 'en',
    front: 'Reciprocal Rank Fusion (RRF)',
    back: 'An information retrieval ranking technique that combines the positions of items from multiple heterogeneous search algorithms (e.g. dense vectors + BM25 keyword matching) without requiring score normalization: RRF(d) = Σ 1 / (60 + r(d)).',
    stability: 2.5,
    difficulty: 0.3,
    reps: 3,
    lapses: 0,
    state: 'review',
    due_at: new Date().toISOString(),
  },
  {
    id: 'card-2',
    language: 'en',
    front: 'Byzantine Fault Tolerance (BFT)',
    back: 'The property of a distributed consensus network that can maintain verifiable agreement even when up to f of 3f+1 nodes act dishonestly, fail silently, or transmit contradictory states.',
    stability: 3.2,
    difficulty: 0.4,
    reps: 4,
    lapses: 0,
    state: 'review',
    due_at: new Date().toISOString(),
  },
  {
    id: 'card-3',
    language: 'mya',
    front: 'ဉာဏ်ရည်တု အသိပညာ သိုလှောင်ရုံ (Knowledge Vault)',
    back: 'သတင်းအချက်အလက်များကို AI ဖြင့် အလိုအလျောက် သုတေသနပြုခွဲခြမ်းစိပ်ဖြာကာ သံသယဖြစ်ဖွယ်မရှိသော အချက်အလက်အဖြစ် ပြောင်းလဲသိုလှောင်ထားသည့် ဒေတာဗဟိုချက်။',
    stability: 1.8,
    difficulty: 0.2,
    reps: 1,
    lapses: 0,
    state: 'learning',
    due_at: new Date().toISOString(),
  },
];

export default function TutorPage() {
  const [cards, setCards] = useState<ApiLanguageCard[]>(DEMO_CARDS);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      const res = await getDueLanguageCards();
      setCards(res.items.length > 0 ? res.items : DEMO_CARDS);
    } catch {
      setCards(DEMO_CARDS);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!front.trim() || !back.trim()) return;
    try {
      await createLanguageCard({ front: front.trim(), back: back.trim(), language });
      setFront('');
      setBack('');
      await load();
    } catch {
      setCards((prev) => [
        {
          id: `card-${Date.now()}`,
          front: front.trim(),
          back: back.trim(),
          language,
          stability: 2.0,
          difficulty: 0.3,
          reps: 0,
          lapses: 0,
          state: 'learning',
          due_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setFront('');
      setBack('');
    }
  };

  const handleReview = async (cardId: string, rating: 1 | 2 | 3 | 4) => {
    try {
      await reviewLanguageCard(cardId, rating);
    } catch {
      // Local advance
    }
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppShell>
      <PageHeader
        title="Spaced Repetition Tutor"
        description="Master mental models, vocabulary, and core concepts with Ebbinghaus retention scheduling."
      />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <SectionCard
          title="Create Flashcard"
          description="Add a durable term or concept to your active review deck."
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Deck / Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground focus-glow focus:outline-none transition-all"
              >
                <option value="en">English (Cognitive & AI Models)</option>
                <option value="mya">Myanmar3 (Bilingual Corpus)</option>
                <option value="deu">German (Technical Philosophy)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Prompt / Front</label>
              <input
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Term, question, or mental model"
                className="w-full rounded-lg border border-border/50 bg-background-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Explanation / Back</label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Precise definition, derivation, or formula…"
                rows={5}
                className="w-full rounded-lg border border-border/50 bg-background-elevated p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-glow focus:outline-none transition-all font-sans"
              />
            </div>
            <button
              onClick={add}
              disabled={!front.trim() || !back.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Plus className="h-4 w-4" /> Save Card to Deck
            </button>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </SectionCard>

        <SectionCard
          title="Active Review Queue"
          description={`${cards.length} cards scheduled for memory reinforcement today`}
        >
          <div className="space-y-4">
            {cards.map((card) => {
              const isRevealed = Boolean(revealedIds[card.id]);
              return (
                <article
                  key={card.id}
                  className="rounded-xl border border-border/50 bg-background-surface/40 p-5 transition-all hover:border-cyan-500/30"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-border/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Deck: {card.language}
                      </span>
                    </div>
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-400">
                      Stability {card.stability?.toFixed(1) || '2.0'}
                    </span>
                  </div>

                  <div className="py-4">
                    <p className="text-base font-semibold text-foreground">{card.front}</p>
                    {isRevealed ? (
                      <div className="mt-3 rounded-lg border border-border/40 bg-background-elevated/60 p-4 text-xs leading-relaxed text-foreground/90 font-sans animate-fade-in">
                        {card.back}
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleReveal(card.id)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Show Answer &amp; Notes
                      </button>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border/30 pt-3">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground mr-1">Feedback:</span>
                      {[
                        { rate: 1, label: 'Again', desc: '< 10m', color: 'border-destructive/40 text-destructive bg-destructive/10' },
                        { rate: 2, label: 'Hard', desc: '12h', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
                        { rate: 3, label: 'Good', desc: '2d', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
                        { rate: 4, label: 'Easy', desc: '5d', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
                      ].map((btn) => (
                        <button
                          key={btn.rate}
                          onClick={() => handleReview(card.id, btn.rate as 1 | 2 | 3 | 4)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95 ${btn.color}`}
                        >
                          {btn.label} <span className="font-mono text-[10px] opacity-75">({btn.desc})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
            {cards.length === 0 && (
              <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-400" />
                All cards completed for today! New reviews will unlock tomorrow based on decay curves.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
