"use client";

import { useLayoutEffect, useRef } from "react";

/* ===========================================================
   BODY AUTO-FIT

   The 50 slide bodies were authored at wildly different densities:
   some are a single small diagram, others are two-column dashboards.
   A single global zoom leaves the sparse ones floating in dead space
   and clips the dense ones.

   This finds, per slide, the largest scale at which the authored body
   still fits its fixed box. Because the body is width-constrained,
   scaling it up narrows it in CSS pixels and makes it reflow TALLER —
   so rendered height is not a linear function of scale and cannot be
   solved with a single ratio. Rendered height IS monotonic in scale,
   though, so a short binary search converges reliably.

   Runs once per slide, the first time that slide becomes active, so
   only one slide is ever measured at a time.
   =========================================================== */

const MIN_SCALE = 0.85; // allow slight shrink rather than ever clipping
const DEFAULT_MAX_SCALE = 1.7; // beyond this, body type outgrows the slide title
const ITERATIONS = 6; // ~0.013 precision over the range
const BOTTOM_MARGIN = 0.96; // leave ~4% headroom so nothing touches the edge

/**
 * @param maxScale Upper bound on the fit. Session 1's bespoke widgets are
 *   hand-sized and look wrong stretched far past their design size, so they
 *   keep the conservative default. Block-composed slides are built to scale
 *   and can be allowed further, which stops sparse ones (a three-line
 *   terminal, say) floating in dead space.
 */
export function useFitScale(active: boolean, maxScale = DEFAULT_MAX_SCALE) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const settled = useRef(false);

  useLayoutEffect(() => {
    if (!active || settled.current) return;
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;

    const fit = () => {
      // Compare rect-to-rect: both sit under the stage's scale transform,
      // so their ratio is correct even though the stage is scaled.
      const box_h = box.getBoundingClientRect().height;
      if (!box_h) return false;

      // Fit to slightly less than the full box. Without this the search
      // returns the scale at which content EXACTLY fills the box, so tall
      // slides end up with their last row pressed against the edge and
      // their drop shadow clipped. The margin costs a little size and
      // buys every slide some breathing room.
      const avail = box_h * BOTTOM_MARGIN;

      const heightAt = (z: number) => {
        inner.style.zoom = String(z);
        return inner.getBoundingClientRect().height;
      };

      let lo = MIN_SCALE;
      let hi = maxScale;

      if (heightAt(hi) <= avail) {
        lo = hi; // content is small enough to take the maximum
      } else {
        for (let i = 0; i < ITERATIONS; i++) {
          const mid = (lo + hi) / 2;
          if (heightAt(mid) <= avail) lo = mid;
          else hi = mid;
        }
      }

      inner.style.zoom = String(lo);
      return true;
    };

    if (fit()) settled.current = true;

    // Web fonts change metrics after first paint — re-fit once they land.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      cancelled = true;
    };
  }, [active, maxScale]);

  return { boxRef, innerRef };
}
