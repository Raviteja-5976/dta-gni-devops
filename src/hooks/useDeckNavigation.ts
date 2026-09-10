"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ===========================================================
   DECK NAVIGATION  (frontend-slides required JS features)

   Every presentation must support:
     1. Keyboard  — arrows, space, page up/down, home/end
     2. Touch     — horizontal swipe
     3. Mouse     — wheel / trackpad
   plus deck-level shortcuts (fullscreen, slide overview).
   =========================================================== */

interface DeckNavigationOptions {
  total: number;
  /** Suspend navigation while a modal owns the keyboard. */
  enabled?: boolean;
  onToggleFullscreen?: () => void;
  onToggleGrid?: () => void;
  onEscape?: () => void;
}

/** One wheel gesture = one slide. Trackpads fire dozens of events. */
const WHEEL_COOLDOWN_MS = 650;
const WHEEL_THRESHOLD = 24;
/** Minimum horizontal travel before a touch counts as a swipe. */
const SWIPE_THRESHOLD = 60;

export function useDeckNavigation({
  total,
  enabled = true,
  onToggleFullscreen,
  onToggleGrid,
  onEscape,
}: DeckNavigationOptions) {
  const [index, setIndex] = useState(0);
  /** +1 when moving forward, -1 back — drives the transition direction. */
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const clamped = Math.max(0, Math.min(next, total - 1));
        if (clamped !== prev) setDirection(clamped > prev ? 1 : -1);
        return clamped;
      });
    },
    [total]
  );

  const goToNext = useCallback(() => {
    setIndex((prev) => {
      if (prev >= total - 1) return prev;
      setDirection(1);
      return prev + 1;
    });
  }, [total]);

  const goToPrev = useCallback(() => {
    setIndex((prev) => {
      if (prev <= 0) return prev;
      setDirection(-1);
      return prev - 1;
    });
  }, []);

  /* --- 1. Keyboard navigation ------------------------------ */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTextEntry =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      // Escape must still work inside the overview's search field.
      if (isTextEntry) {
        if (e.key === "Escape") onEscape?.();
        return;
      }

      // Deck-level shortcuts stay live even when slide nav is suspended.
      switch (e.key) {
        case "Escape":
          onEscape?.();
          return;
        case "f":
        case "F":
          e.preventDefault();
          onToggleFullscreen?.();
          return;
        case "o":
        case "O":
        case "g":
        case "G":
          e.preventDefault();
          onToggleGrid?.();
          return;
      }

      if (!enabled) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          goToNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "Backspace":
        case "PageUp":
          e.preventDefault();
          goToPrev();
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(total - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, goTo, goToNext, goToPrev, total, onToggleFullscreen, onToggleGrid, onEscape]);

  /* --- 2. Touch / swipe navigation -------------------------- */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;

      // Horizontal intent only — ignore vertical scroll-ish gestures.
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) goToNext();
      else goToPrev();
    },
    [enabled, goToNext, goToPrev]
  );

  /* --- 3. Mouse wheel / trackpad ---------------------------- */
  const lastWheel = useRef(0);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enabled) return;

      // Let genuinely scrollable inner panels (terminals, code blocks)
      // consume the gesture instead of changing slide.
      const scrollable = (e.target as HTMLElement)?.closest?.(
        "[data-deck-scrollable]"
      );
      if (scrollable) return;

      const now = Date.now();
      if (now - lastWheel.current < WHEEL_COOLDOWN_MS) return;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;

      lastWheel.current = now;
      if (delta > 0) goToNext();
      else goToPrev();
    },
    [enabled, goToNext, goToPrev]
  );

  return {
    index,
    direction,
    goTo,
    goToNext,
    goToPrev,
    /** Spread onto the deck viewport element. */
    gestureHandlers: { onTouchStart, onTouchEnd, onWheel },
  };
}
