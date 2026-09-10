"use client";

import React, { useMemo, useState } from "react";
import type { SlideData } from "@/data/slides";
import { X, Search, Check } from "lucide-react";

interface SlideGridModalProps {
  slides: SlideData[];
  currentSlideIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

/* ===========================================================
   SLIDE OVERVIEW — deck chrome, NOT part of the 1920x1080 stage.
   This panel is the one place that legitimately reacts to the real
   browser window, so it uses arbitrary `max-[...]` variants rather
   than the deck's collapsed sm/md/lg breakpoints.
   =========================================================== */

export function SlideGridModal({
  slides,
  currentSlideIndex,
  isOpen,
  onClose,
  onSelectSlide,
}: SlideGridModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSlides = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return slides;
    return slides.filter(
      (slide) =>
        slide.title.toLowerCase().includes(q) ||
        slide.chapter.toLowerCase().includes(q) ||
        (slide.subtitle?.toLowerCase().includes(q) ?? false)
    );
  }, [searchTerm, slides]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#12152B]/85 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Slide overview"
    >
      <div
        className="w-full max-w-6xl max-h-[88vh] flex flex-col bg-[#FFF8F0] border-[8px] border-[#1B1F3B] shadow-[16px_16px_0_#FF6B35] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-7 py-5 bg-[#FF6B35] border-b-[6px] border-[#1B1F3B]">
          <div className="flex items-center gap-4">
            <span className="chip-mono bg-[#1B1F3B] text-[#FFF8F0] text-[12px]">
              {slides.length} Slides
            </span>
            <h3 className="font-display text-2xl text-white tracking-tight">
              Jump to any slide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="tactile-btn tactile-btn-secondary p-2"
            aria-label="Close overview"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-4 bg-[#F5EBE0] border-b-[6px] border-[#1B1F3B] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1B1F3B] shrink-0" />
          <input
            type="text"
            placeholder="Filter by title, topic, or chapter…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent font-mono text-sm text-[#1B1F3B] placeholder-[#1B1F3B]/40 focus:outline-none"
            autoFocus
          />
          <span className="font-mono text-xs font-bold text-[#1B1F3B]/60 shrink-0 tabular-nums">
            {filteredSlides.length} shown
          </span>
        </div>

        {/* Grid */}
        <div
          data-deck-scrollable
          className="p-7 overflow-y-auto grid gap-5 grid-cols-4 max-[1100px]:grid-cols-3 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1"
        >
          {filteredSlides.map((slide) => {
            const actualIndex = slides.indexOf(slide);
            const isCurrent = actualIndex === currentSlideIndex;

            return (
              /* A <div role="button"> rather than a real <button>: a button
                 element refuses to auto-size to its flex content (it stayed
                 pinned at min-height while the content needed ~180px), which
                 pushed the chapter footer out past the card border. */
              <div
                key={slide.id}
                role="button"
                tabIndex={0}
                data-slide-card
                onClick={() => {
                  onSelectSlide(actualIndex);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectSlide(actualIndex);
                    onClose();
                  }
                }}
                aria-current={isCurrent ? "true" : undefined}
                className={`text-left p-4 border-4 border-[#1B1F3B] transition-transform duration-150 flex flex-col justify-between min-h-[160px] cursor-pointer hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-[#4EA8FF] ${
                  isCurrent
                    ? "bg-[#FFC93C] shadow-[8px_8px_0_#FF6B35] hover:shadow-[10px_10px_0_#FF6B35]"
                    : "bg-white shadow-[5px_5px_0_#1B1F3B] hover:shadow-[8px_8px_0_#1B1F3B]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#1B1F3B] bg-[#F5EBE0] px-2 py-0.5 border-2 border-[#1B1F3B] tabular-nums">
                      {String(slide.slideNumber).padStart(2, "0")}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-[#1B1F3B] text-[#FFC93C] px-2 py-0.5 font-bold uppercase">
                        <Check className="w-3 h-3" /> Here
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-[15px] leading-tight text-[#1B1F3B] line-clamp-2">
                    {slide.title}
                  </h4>
                  {slide.subtitle && (
                    <p className="font-sans text-[12px] text-[#1B1F3B]/65 line-clamp-2 mt-1.5">
                      {slide.subtitle}
                    </p>
                  )}
                </div>

                <div className="shrink-0 mt-3 pt-2 border-t-2 border-[#1B1F3B]/20 font-mono text-[10px] font-bold text-[#1B1F3B]/55 truncate uppercase tracking-wider">
                  {slide.chapter}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
