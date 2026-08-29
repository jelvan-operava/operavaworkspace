import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { KnowledgeArticle } from '@/lib/mock-data';

export interface KnowledgeBaseViewProps {
  articles: KnowledgeArticle[];
  openAiAssistant: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  articles,
  openAiAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Architecture', 'Security', 'Billing', 'Deployment'];

  const filtered = articles.filter((art) => {
    const matchesCat = selectedCategory === 'All' ? true : art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleVote = (id: string) => {
    setVotedArticles((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--m3-primary)]" />
            Knowledge Base & SDK Documentation
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Technical guides, SLA terms, API integration patterns, and architecture specs.
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={openAiAssistant}
        >
          Search with Gemini AI
        </M3Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--m3-on-surface-variant)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--m3-surface-container)] text-xs rounded-full focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === c
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold'
                  : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / Reader */}
      {!selectedArticle ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((art) => (
            <M3Card
              key={art.id}
              variant="filled"
              elevation={1}
              interactive
              onClick={() => setSelectedArticle(art)}
              className="p-6 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <M3Badge variant="primary" size="sm">{art.category}</M3Badge>
                  <span className="text-[11px] text-[var(--m3-on-surface-variant)]">{art.readTime}</span>
                </div>

                <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">{art.title}</h3>
                <p className="text-xs text-[var(--m3-on-surface-variant)] line-clamp-3">{art.summary}</p>
              </div>

              <div className="pt-3 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs text-[var(--m3-primary)] font-semibold">
                <span>Read Guide</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </M3Card>
          ))}
        </div>
      ) : (
        <M3Card variant="filled" className="p-8 space-y-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-bold text-[var(--m3-primary)] hover:underline cursor-pointer"
          >
            ← Back to Knowledge Directory
          </button>

          <div className="space-y-2">
            <M3Badge variant="primary" size="sm">{selectedArticle.category}</M3Badge>
            <h2 className="text-2xl font-bold text-[var(--m3-on-surface)]">
              {selectedArticle.title}
            </h2>
            <p className="text-xs text-[var(--m3-on-surface-variant)]">
              Estimated Read Time: {selectedArticle.readTime}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] text-xs leading-relaxed text-[var(--m3-on-surface)] whitespace-pre-wrap">
            {selectedArticle.content}
          </div>

          {/* Voting */}
          <div className="pt-4 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs">
            <span className="text-[var(--m3-on-surface-variant)]">Was this documentation helpful?</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote(selectedArticle.id)}
                disabled={votedArticles[selectedArticle.id]}
                className={`p-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                  votedArticles[selectedArticle.id]
                    ? 'bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)]'
                    : 'bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)]'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{(selectedArticle.helpfulCount || 0) + (votedArticles[selectedArticle.id] ? 1 : 0)} Yes</span>
              </button>
            </div>
          </div>
        </M3Card>
      )}
    </div>
  );
};
