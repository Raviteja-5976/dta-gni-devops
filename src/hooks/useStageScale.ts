"use client";

import { useEffect, useRef } from "react";

/* ===========================================================
   FIXED 16:9 STAGE SCALING  (frontend-slides, non-negotiable)

   Slides are authored at STAGE_W x STAGE_H and the ENTIRE stage
   is scaled by a single transform to fit the window. The deck
   letterboxes/pillarboxes — it never re-lays-out slide content
   for narrow screens. This is what makes the deck look identical
   on a projector, a laptop and a phone.
   =========================================================== */

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export function useStageScale<T extends HTMLElement>() {
  const stageRef = useRef<T | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const applyScale = () => {
      // visualViewport is more accurate on mobile (accounts for the
      // dynamic URL bar); fall back to innerWidth/innerHeight.
      const vw = window.visualViewport?.width ?? window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;

      const factor = Math.min(vw / STAGE_W, vh / STAGE_H);
      const x = (vw - STAGE_W * factor) / 2;
      const y = (vh - STAGE_H * factor) / 2;

      stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
    };

    applyScale();

    // rAF-throttle so drag-resizing stays smooth.
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(applyScale);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    document.addEventListener("fullscreenchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      document.removeEventListener("fullscreenchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  return stageRef;
}
