"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SlideData } from "@/data/slides";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import { SlideGridModal } from "@/components/SlideGridModal";
import { useStageScale } from "@/hooks/useStageScale";
import { useDeckNavigation } from "@/hooks/useDeckNavigation";
import {
  ArrowLeft,
  ArrowRight,
  Maximize,
  Minimize,
  Grid,
  Home,
} from "lucide-react";

/** Hide the deck chrome after this long without pointer movement. */
const CHROME_IDLE_MS = 2600;

interface DeckShellProps {
  slides: SlideData[];
  sessionNumber: number;
  sessionTitle: string;
}

export function DeckShell({
  slides,
  sessionNumber,
  sessionTitle,
}: DeckShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);

  const totalSlides = slides.length;

  /* Fixed 1920x1080 stage, scaled as a whole to the window. */
  const stageRef = useStageScale<HTMLDivElement>();

  /* The deck owns the whole window while it is mounted. Scoped here
     rather than in globals.css so the homepage and admin page keep
     normal document scrolling. */
  useEffect(() => {
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevSelect = body.style.userSelect;
    body.style.overflow = "hidden";
    body.style.userSelect = "none";
    return () => {
      body.style.overflow = prevOverflow;
      body.style.userSelect = prevSelect;
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const toggleGrid = useCallback(() => setGridOpen((v) => !v), []);
  const closeGrid = useCallback(() => setGridOpen(false), []);

  /* Keyboard + swipe + wheel navigation. */
  const { index, goTo, goToNext, goToPrev, gestureHandlers } = useDeckNavigation({
    total: totalSlides,
    enabled: !gridOpen,
    onToggleFullscreen: toggleFullscreen,
    onToggleGrid: toggleGrid,
    onEscape: closeGrid,
  });

  /* Track fullscreen changes triggered outside our button (Esc, F11). */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* Auto-hide chrome while presenting; any pointer movement brings it back. */
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const wake = () => {
      setChromeVisible(true);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setChromeVisible(false), CHROME_IDLE_MS);
    };
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);
    window.addEventListener("keydown", wake);
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  // Chrome stays pinned open while the overview modal is up.
  const showChrome = chromeVisible || gridOpen;

  return (
    <div className="deck-viewport" {...gestureHandlers}>
      {/* =========================================================
          FIXED 1920x1080 STAGE
          Every slide is authored at this exact size. The stage is
          scaled by one transform — content is never reflowed.
          ========================================================= */}
      <div ref={stageRef} className="deck-stage">
        {slides.map((slide, i) => {
          const isActive = i === index;
          return (
            <section
              key={slide.id}
              className={`slide ${isActive ? "active visible" : ""}`}
              aria-hidden={!isActive}
              aria-label={`Slide ${slide.slideNumber}: ${slide.title}`}
            >
              <SlideRenderer
                slide={slide}
                isActive={isActive}
                totalSlides={totalSlides}
                onNextSlide={goToNext}
                onPrevSlide={goToPrev}
              />
            </section>
          );
        })}
      </div>

      {/* =========================================================
          DECK CHROME — lives OUTSIDE the slide design system.
          One bottom strip, so it never covers the slide's own brand
          rail or slide-number badge. Auto-hides while presenting.
          ========================================================= */}
      <nav
        aria-label="Deck controls"
        className={`deck-chrome bottom-5 left-5 right-5 flex items-center justify-between gap-4 transition-all duration-300 ${
          showChrome
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="tactile-btn tactile-btn-secondary px-3 py-2 text-xs shrink-0"
            title="Back to all sessions"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="max-[900px]:hidden">Sessions</span>
          </Link>

          <span className="shrink-0 inline-flex items-center bg-[#FFF8F0] text-[#1B1F3B] px-3 py-2 border-4 border-[#1B1F3B] shadow-[4px_4px_0_#1B1F3B] font-mono text-xs font-bold tabular-nums">
            {String(index + 1).padStart(2, "0")}
            <span className="opacity-40 px-1">/</span>
            {String(totalSlides).padStart(2, "0")}
          </span>

          {/* Segmented brutalist progress bar */}
          <div
            className="shrink-0 flex max-[720px]:hidden w-44 h-4 bg-[#F5EBE0] border-4 border-[#1B1F3B] shadow-[4px_4px_0_#1B1F3B] overflow-hidden"
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={totalSlides}
          >
            <div
              className="h-full bg-[#FF6B35] transition-[width] duration-300 ease-out"
              style={{ width: `${((index + 1) / totalSlides) * 100}%` }}
            />
          </div>

          <span className="inline max-[1250px]:hidden font-mono text-[11px] text-[#FFF8F0]/45 tracking-wide truncate">
            Session {sessionNumber} · {sessionTitle}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleGrid}
            className="tactile-btn tactile-btn-secondary px-4 py-2 text-xs"
            title="Slide overview (O)"
          >
            <Grid className="w-4 h-4 shrink-0" />
            <span className="max-[900px]:hidden">Slides</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="tactile-btn tactile-btn-sky px-4 py-2 text-xs"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 shrink-0" />
            ) : (
              <Maximize className="w-4 h-4 shrink-0" />
            )}
            <span className="max-[900px]:hidden">
              {isFullscreen ? "Exit" : "Full"}
            </span>
          </button>

          {/* Divider between deck-level and slide-level controls */}
          <span
            aria-hidden
            className="w-1 h-8 bg-[#FFF8F0]/25 max-[720px]:hidden"
          />

          <button
            onClick={goToPrev}
            disabled={index === 0}
            className="tactile-btn tactile-btn-secondary px-4 py-2 text-xs"
            title="Previous slide (←)"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="max-[720px]:hidden">Prev</span>
          </button>

          <button
            onClick={goToNext}
            disabled={index === totalSlides - 1}
            className="tactile-btn tactile-btn-primary px-5 py-2 text-xs"
            title="Next slide (→ / Space)"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </nav>

      {/* Slide overview / jump-to modal */}
      <SlideGridModal
        slides={slides}
        currentSlideIndex={index}
        isOpen={gridOpen}
        onClose={closeGrid}
        onSelectSlide={goTo}
      />
    </div>
  );
}
