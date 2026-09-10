"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlideData } from "@/data/slides";
import { useFitScale } from "@/hooks/useFitScale";
import { BlockRenderer } from "@/components/slides/blocks/BlockRenderer";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { KubernetesClusterSim } from "@/components/widgets/KubernetesClusterSim";
import { CicdPipelineVisualizer } from "@/components/widgets/CicdPipelineVisualizer";
import { DependencyConflictSim } from "@/components/widgets/DependencyConflictSim";
import { VmVsContainerDiagram } from "@/components/widgets/VmVsContainerDiagram";
import { TerraformClickOpsVsCode } from "@/components/widgets/TerraformClickOpsVsCode";
import { DevOpsLoopDiagram } from "@/components/widgets/DevOpsLoopDiagram";
import { CharacterCard } from "@/components/widgets/CharacterCard";
import confetti from "canvas-confetti";
import {
  Server,
  Users,
  Code2,
  Box,
  Rocket,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Database,
  Network,
  Share2,
} from "lucide-react";

interface SlideRendererProps {
  slide: SlideData;
  /** True when this slide is the one on screen — gates the reveal stagger. */
  isActive?: boolean;
  /** Slide count for THIS session's deck. */
  totalSlides?: number;
  onNextSlide?: () => void;
  onPrevSlide?: () => void;
}

export function SlideRenderer({
  slide,
  isActive = false,
  totalSlides = 50,
  onNextSlide,
}: SlideRendererProps) {
  const [orderCount, setOrderCount] = useState(148);

  /* Scale this slide's authored body to fill its fixed box exactly.
     Block-composed slides scale further than Session 1's hand-built
     widgets, which are drawn at a fixed size and distort if pushed. */
  const { boxRef: bodyBoxRef, innerRef: bodyInnerRef } = useFitScale(
    isActive,
    slide.blocks ? 2.1 : undefined
  );

  /* The title slide is its own full-bleed statement — it opts out of the
     standard chapter/title header so the headline isn't printed twice. */
  const isTitleSlide = slide.interactiveType === "title_hero";

  const triggerCelebrate = () => {
    setOrderCount((c) => c + 1);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    /* =========================================================
       SLIDE FRAME — authored at the 1920x1080 stage size.
       All measurements are fixed px at design scale; the stage
       transform handles every screen size. No breakpoints here.
       ========================================================= */
    <div className="w-full h-full flex flex-col px-[72px] py-[56px] overflow-hidden">
      {/* --- Brand rail: part of the slide design, not deck chrome --- */}
      <div className="reveal reveal-1 flex-shrink-0 flex items-center justify-between gap-6 pb-4 border-b-[6px] border-[#1B1F3B]">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 overflow-hidden border-4 border-[#1B1F3B] bg-white shrink-0 shadow-[5px_5px_0_#1B1F3B]">
            <Image
              src="/logo.png"
              alt="DevTrackAcademy"
              fill
              className="object-contain p-1"
              sizes="56px"
            />
          </div>
          <span className="font-display text-[26px] text-[#1B1F3B] tracking-tight">
            DevTrackAcademy
          </span>
          <span className="chip-mono bg-[#FF6B35] text-white text-[13px]">
            Workshop
          </span>
        </div>

        <span className="font-mono text-[15px] font-bold text-[#1B1F3B] bg-white px-4 py-1.5 border-4 border-[#1B1F3B] shadow-[4px_4px_0_#1B1F3B] tabular-nums">
          SLIDE {String(slide.slideNumber).padStart(2, "0")} /{" "}
          {String(totalSlides).padStart(2, "0")}
        </span>
      </div>

      {/* --- Title block ---
          Suppressed on the title slide: its hero card already carries the
          headline, and rendering both duplicated the deck title. */}
      <div className={`flex-shrink-0 pt-7 pb-5 ${isTitleSlide ? "hidden" : ""}`}>
        <div className="reveal reveal-2 flex items-center gap-3 mb-4">
          <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[14px]">
            {slide.chapter}
          </span>
          {slide.badge && (
            <span className="chip-mono bg-[#FFC93C] text-[#1B1F3B] text-[14px]">
              {slide.badge}
            </span>
          )}
        </div>

        <h1 className="reveal-slam font-display text-[58px] leading-[1.05] text-[#1B1F3B] tracking-[-0.03em]">
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p className="reveal reveal-3 mt-4 font-sans font-medium text-[24px] leading-snug text-[#1B1F3B]/75 max-w-[1400px]">
            {slide.subtitle}
          </p>
        )}

        {/* Sarcastic Developer Joke Callout (if present) */}
        {slide.joke && (
          <div className="reveal reveal-4 mt-5 p-3 bg-[#FFC93C] border-4 border-[#1B1F3B] shadow-[6px_6px_0_#1B1F3B] inline-flex items-center gap-3 max-w-full tilt-neg-1">
            <span className="px-3 py-1 bg-[#1B1F3B] text-[#FFC93C] font-display text-[14px] shrink-0">
              JOKE
            </span>
            <span className="font-display text-[19px] text-[#1B1F3B]">
              &ldquo;{slide.joke}&rdquo;
            </span>
          </div>
        )}
      </div>

      {/* --- Slide body ---
          Outer box is the fixed measuring frame (never scaled). The inner
          wrapper is scaled by useFitScale so each slide's authored content
          fills its box without ever spilling out of the 1920x1080 stage. */}
      <div
        ref={bodyBoxRef}
        className="reveal reveal-5 flex-1 min-h-0 flex flex-col justify-center overflow-hidden"
      >
        <div ref={bodyInnerRef} className="slide-body w-full">
        {/* Session 2+ decks are composed from typed layout blocks. */}
        {slide.blocks && <BlockRenderer blocks={slide.blocks} />}

        {/* SLIDE 1: Title Hero */}
        {slide.interactiveType === "title_hero" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-5 my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4EA8FF] text-[#1B1F3B] border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              <Sparkles className="w-3.5 h-3.5" />
              DevTrackAcademy Live Workshop Series
            </div>

            <div className="max-w-2xl mx-auto space-y-2">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1B1F3B] leading-tight">
                From <span className="marker">&ldquo;It Works on My Machine&rdquo;</span> to Docker
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#1B1F3B]/70">
                A story-driven, architectural journey through modern software engineering.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onNextSlide}
                className="tactile-btn tactile-btn-primary px-6 py-3 text-sm"
              >
                <span>Start Session 1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-[#1B1F3B]/10 flex flex-wrap justify-center gap-4 font-mono text-[11px] text-[#1B1F3B]/60">
              <span>→ Space / Right Arrow: Next</span>
              <span>← Left Arrow: Prev</span>
              <span>[F] Fullscreen Mode</span>
              <span>[O] 50-Slide Grid</span>
            </div>
          </div>
        )}

        {/* SLIDE 2: Lehar Loom E-commerce */}
        {slide.interactiveType === "ecommerce_preview" && (
          <div className="card-brut bg-white p-4 sm:p-6 space-y-4 my-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 relative h-[200px] sm:h-[240px] md:h-[270px] rounded-2xl overflow-hidden border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B]">
                <Image
                  src="/assets/lehar_loom.jpg"
                  alt="Lehar Loom Store"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="md:col-span-5 space-y-3">
                <span className="chip-mono bg-[#FF6B35] text-white text-[10px]">Client File #001</span>
                <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">
                  Lehar Loom Pvt Ltd
                </h3>
                <p className="font-sans text-xs text-[#1B1F3B]/80 leading-relaxed">
                  Fastest growing ethnic clothing retailer online. Handcrafted kurtas, sarees, and festive wear shipped across India.
                </p>
                <div className="p-3 bg-[#FFF8F0] border-2 border-[#1B1F3B] rounded-xl space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#1B1F3B]/60">Stack:</span>
                    <strong className="text-[#1B1F3B]">Node.js + React</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1B1F3B]/60">Infrastructure:</span>
                    <strong className="text-[#FF6B35]">1 Office Server</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1B1F3B]/60">Headcount:</span>
                    <strong className="text-[#1B1F3B]">1 Developer (Sam)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: Character Sam */}
        {slide.interactiveType === "character_sam" && (
          <CharacterCard
            name="Sam"
            role="Senior Software Developer & Reluctant SysAdmin"
            badge="LEAD ARCHITECT"
            imageSrc="/assets/sam_developer.jpg"
            quote="If it works on my machine, we should just ship my machine to the cloud."
            attributes={[
              { label: "Experience", value: "8+ Years" },
              { label: "Coffee Intake", value: "5 Cups / Day" },
              { label: "Monitors", value: "3 Displays" },
              { label: "Specialty", value: "Solving 2AM Crashes" },
            ]}
          />
        )}

        {/* SLIDE 4: Single Server */}
        {slide.interactiveType === "single_server" && (
          <div className="card-brut bg-white p-6 text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="p-4 bg-[#FFF8F0] border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-1.5">
              <div className="p-2.5 bg-[#FF6B35] text-white rounded-xl inline-block">
                <Server className="w-6 h-6" />
              </div>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">
                Physical Office Server
              </h4>
              <p className="font-mono text-xs text-[#1B1F3B]/60">
                Dual Xeon • 64GB RAM • Humming quietly near the water cooler
              </p>
            </div>

            <div className="font-display font-extrabold text-2xl text-[#1B1F3B]">↓</div>

            <div className="p-3.5 bg-[#6EE7B7] border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] font-display font-extrabold text-base text-[#1B1F3B]">
              Lehar Loom Website (Port 80 / 443)
            </div>
          </div>
        )}

        {/* SLIDE 5: Sam Multirole */}
        {slide.interactiveType === "sam_multirole" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <div className="p-2.5 bg-[#4EA8FF] text-[#1B1F3B] rounded-xl inline-block">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">1. Developer</h4>
              <p className="font-sans text-xs text-[#1B1F3B]/70">
                Writes product features, creates responsive layouts, builds shopping cart logic.
              </p>
            </div>
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <div className="p-2.5 bg-[#FF6B35] text-white rounded-xl inline-block">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">2. SysAdmin</h4>
              <p className="font-sans text-xs text-[#1B1F3B]/70">
                Configures Nginx reverse proxies, creates systemd daemons, manages SSL certificates.
              </p>
            </div>
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <div className="p-2.5 bg-[#FFC93C] text-[#1B1F3B] rounded-xl inline-block">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">3. Support</h4>
              <p className="font-sans text-xs text-[#1B1F3B]/70">
                Receives emergency calls when payment gateways fail at midnight on Diwali sales.
              </p>
            </div>
          </div>
        )}

        {/* SLIDE 6: Success & Orders */}
        {slide.interactiveType === "success_orders" && (
          <div className="card-brut bg-[#6EE7B7]/20 p-6 text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6EE7B7] text-[#1B1F3B] border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Store Status: ONLINE & PROFITABLE
            </div>

            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="font-mono text-xs font-bold text-[#1B1F3B]/60 uppercase">
                Live Orders Today
              </span>
              <div className="font-display font-extrabold text-5xl text-[#FF6B35] tabular-nums">
                {orderCount}
              </div>
              <button
                onClick={triggerCelebrate}
                className="tactile-btn tactile-btn-primary px-4 py-2 text-xs mt-1"
              >
                🎉 Simulate New Customer Order!
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 7: Growth Stairs */}
        {slide.interactiveType === "growth_stairs" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-auto">
            <div className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[9px]">Stage 1</span>
              <h4 className="font-display font-extrabold text-base text-[#1B1F3B]">Ethnic Wear</h4>
              <p className="font-mono text-[11px] text-[#1B1F3B]/60">Lehar Loom</p>
            </div>
            <div className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
              <span className="chip-mono bg-[#FFC93C] text-[#1B1F3B] text-[9px]">Stage 2</span>
              <h4 className="font-display font-extrabold text-base text-[#1B1F3B]">Candles</h4>
              <p className="font-mono text-[11px] text-[#1B1F3B]/60">Lehar Candles</p>
            </div>
            <div className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
              <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[9px]">Stage 3</span>
              <h4 className="font-display font-extrabold text-base text-[#1B1F3B]">Decor</h4>
              <p className="font-mono text-[11px] text-[#1B1F3B]/60">Lehar Living</p>
            </div>
            <div className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
              <span className="chip-mono bg-[#FF5C7A] text-white text-[9px]">Stage 4</span>
              <h4 className="font-display font-extrabold text-base text-[#1B1F3B]">More Brands...</h4>
              <p className="font-mono text-[11px] text-[#1B1F3B]/60">Scale Challenge</p>
            </div>
          </div>
        )}

        {/* SLIDE 8: Split Brands */}
        {slide.interactiveType === "split_brands" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#FF6B35] text-white text-[10px]">Brand #1</span>
              <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">Lehar Loom</h3>
              <p className="font-sans text-xs text-[#1B1F3B]/70">
                Ethnic wear portal built on Node 20. High traffic, heavy image caching.
              </p>
              <div className="font-mono text-xs text-[#FF6B35] font-bold">leharloom.com</div>
            </div>
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[10px]">Brand #2</span>
              <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">Lehar Candles</h3>
              <p className="font-sans text-xs text-[#1B1F3B]/70">
                Luxury aromatherapy website acquired from an agency, running on Node 18.
              </p>
              <div className="font-mono text-xs text-[#4EA8FF] font-bold">leharcandles.com</div>
            </div>
          </div>
        )}

        {/* SLIDE 9: Two Apps One Server */}
        {slide.interactiveType === "two_apps_one_server" && (
          <div className="card-brut bg-white p-6 text-center space-y-4 max-w-xl mx-auto my-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FF6B35] text-white font-display font-extrabold text-sm rounded-xl border-2 border-[#1B1F3B]">
                Lehar Loom (App A)
              </div>
              <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] font-display font-extrabold text-sm rounded-xl border-2 border-[#1B1F3B]">
                Lehar Candles (App B)
              </div>
            </div>
            <div className="font-display font-extrabold text-xl text-[#1B1F3B]">↓</div>
            <div className="p-4 bg-[#F5EBE0] border-3 border-[#1B1F3B] rounded-2xl shadow-[3px_3px_0_#1B1F3B]">
              <div className="font-display font-extrabold text-base text-[#1B1F3B]">
                Same Single Physical Server
              </div>
              <div className="font-mono text-xs text-[#1B1F3B]/60 mt-0.5">
                One global filesystem • One /usr/local/bin • One shared set of packages
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 10: Dependency Warning */}
        {slide.interactiveType === "dependency_warning" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#FF6B35] text-white text-[10px]">Loom Stack</span>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Requirements A</h4>
              <ul className="font-mono text-xs space-y-1 text-[#1B1F3B]">
                <li>• Node.js: <strong className="text-[#FF6B35]">v20.10 LTS</strong></li>
                <li>• Package X: <strong className="text-[#FF6B35]">v2.4.0 (Modern)</strong></li>
                <li>• OpenSSL: <strong>3.0</strong></li>
              </ul>
            </div>
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[10px]">Candles Stack</span>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Requirements B</h4>
              <ul className="font-mono text-xs space-y-1 text-[#1B1F3B]">
                <li>• Node.js: <strong className="text-[#4EA8FF]">v18.12 Legacy</strong></li>
                <li>• Package X: <strong className="text-[#4EA8FF]">v1.0.8 (Deprecated)</strong></li>
                <li>• OpenSSL: <strong>1.1.1</strong></li>
              </ul>
            </div>
          </div>
        )}

        {/* SLIDE 11: Tug of War Interactive Sim */}
        {slide.interactiveType === "tug_of_war" && <DependencyConflictSim />}

        {/* SLIDE 12: Terminal Nervous */}
        {slide.interactiveType === "terminal_nervous" && (
          <div className="my-auto max-w-2xl mx-auto w-full">
            <TerminalSimulator
              initialCommand="npm update"
              outputLines={[
                { text: "npm WARN deprecated package-x@1.0.8: This package is no longer supported.", type: "warn" },
                { text: "npm ERR! code ERESOLVE", type: "error" },
                { text: "npm ERR! ERESOLVE could not resolve dependency peer conflict:", type: "error" },
                { text: "npm ERR! Conflicting peer: package-x@2.4.0 requires Node >= 20.0.0", type: "error" },
                { text: "npm ERR! But current environment has global Node v18.12.0 for Candles", type: "error" },
                { text: "💥 FATAL: Production build aborted with 18 unresolved conflicts.", type: "error" },
              ]}
            />
          </div>
        )}

        {/* SLIDE 13: Hypervisor VMs */}
        {slide.interactiveType === "hypervisor_vms" && (
          <div className="card-brut bg-white p-6 text-center space-y-3 max-w-lg mx-auto my-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FF6B35] text-white rounded-xl border-2 border-[#1B1F3B]">
                <div className="font-display font-extrabold text-base">VM 1</div>
                <div className="font-mono text-xs">Lehar Loom</div>
              </div>
              <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B]">
                <div className="font-display font-extrabold text-base">VM 2</div>
                <div className="font-mono text-xs">Lehar Candles</div>
              </div>
            </div>
            <div className="p-3 bg-[#FFC93C] border-2 border-[#1B1F3B] rounded-xl font-display font-extrabold text-sm text-[#1B1F3B]">
              Hypervisor (ESXi / KVM / Proxmox)
            </div>
            <div className="p-3 bg-[#1B1F3B] text-white border-2 border-[#1B1F3B] rounded-xl font-display font-extrabold text-sm">
              Physical Server Hardware
            </div>
          </div>
        )}

        {/* SLIDE 14: Isolated Envs */}
        {slide.interactiveType === "isolated_envs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[10px]">VM 1 Isolated</span>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Linux Ubuntu 22</h4>
              <div className="font-mono text-xs space-y-1 text-[#1B1F3B]/80">
                <div>• Node.js 20 Installed</div>
                <div>• Package X v2 Installed</div>
                <div>• Lehar Loom running happy</div>
              </div>
            </div>
            <div className="p-5 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2">
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[10px]">VM 2 Isolated</span>
              <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Linux Debian 11</h4>
              <div className="font-mono text-xs space-y-1 text-[#1B1F3B]/80">
                <div>• Node.js 18 Installed</div>
                <div>• Package X v1 Installed</div>
                <div>• Lehar Candles running happy</div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 15: OS Overhead Comparison */}
        {slide.interactiveType === "os_overhead_comparison" && <VmVsContainerDiagram />}

        {/* SLIDE 16: VM Explosion */}
        {slide.interactiveType === "vm_explosion" && (
          <div className="card-brut bg-white p-5 space-y-3 my-auto">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-2.5 bg-[#FFF8F0] border-2 border-[#1B1F3B] rounded-xl text-center space-y-0.5">
                  <span className="chip-mono text-[8px] bg-[#FF5C7A] text-white px-1 py-0.1">VM #{i + 1}</span>
                  <div className="font-mono text-xs font-bold text-[#1B1F3B]">4GB OS</div>
                  <div className="font-sans text-[9px] text-[#1B1F3B]/60">App {i + 1}</div>
                </div>
              ))}
            </div>
            <div className="p-2.5 bg-[#FF5C7A]/15 border-2 border-[#FF5C7A] rounded-xl text-center font-mono text-xs font-bold text-[#FF5C7A]">
              🚨 Total Memory Wasted: 40 GB RAM just for duplicate Ubuntu kernels!
            </div>
          </div>
        )}

        {/* SLIDE 17: Team Growth */}
        {slide.interactiveType === "team_growth" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
            {[
              { name: "Sam", role: "Senior Dev (MacBook)", color: "bg-[#FF6B35] text-white" },
              { name: "Priya", role: "Frontend Dev (MacBook)", color: "bg-[#4EA8FF] text-[#1B1F3B]" },
              { name: "Rahul", role: "Backend Dev (Ubuntu)", color: "bg-[#6EE7B7] text-[#1B1F3B]" },
              { name: "Anita", role: "QA Engineer (Windows)", color: "bg-[#FFC93C] text-[#1B1F3B]" },
            ].map((member, i) => (
              <div key={i} className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
                <span className={`chip-mono text-[9px] ${member.color}`}>{member.name}</span>
                <h4 className="font-display font-extrabold text-base text-[#1B1F3B]">{member.name}</h4>
                <p className="font-mono text-[11px] text-[#1B1F3B]/70">{member.role}</p>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 18: Priya Clone */}
        {slide.interactiveType === "priya_clone" && (
          <div className="my-auto max-w-2xl mx-auto w-full">
            <TerminalSimulator
              title="priya@laptop: ~/workspace"
              initialCommand="git clone git@github.com:lehar/loom.git && cd loom && npm install"
              outputLines={[
                { text: "Cloning into 'loom'...", type: "highlight" },
                { text: "Receiving objects: 100% (4120/4120), 12.42 MiB, done.", type: "success" },
                { text: "added 1420 packages in 18s", type: "success" },
                { text: "priya@laptop:~/workspace/loom$ npm run dev", type: "warn" },
              ]}
            />
          </div>
        )}

        {/* SLIDE 19: Priya Error Bang */}
        {slide.interactiveType === "priya_error_bang" && (
          <div className="card-brut bg-white p-4 sm:p-6 space-y-3 my-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 relative h-[200px] sm:h-[240px] md:h-[270px] rounded-2xl overflow-hidden border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B]">
                <Image
                  src="/assets/priya_error.jpg"
                  alt="Priya Build Error"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="md:col-span-5 space-y-2">
                <span className="chip-mono bg-[#FF5C7A] text-white text-[10px]">FATAL CRASH</span>
                <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">
                  Node-Gyp Bindings Failed
                </h3>
                <p className="font-mono text-xs text-[#FF5C7A] bg-[#FF5C7A]/10 p-2.5 rounded-xl border border-[#FF5C7A]">
                  Error: Cannot find module &apos;./build/Release/canvas.node&apos;. Missing Xcode tools, Cairo headers, and Python 3.9 path.
                </p>
                <div className="font-sans text-xs text-[#1B1F3B]/70">
                  Priya is on Apple Silicon ARM64. Sam developed on Intel x86 Ubuntu 2 years ago.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 20: Works on my machine */}
        {slide.interactiveType === "works_on_my_machine" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-6 max-w-2xl mx-auto my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5C7A] text-white border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              <XCircle className="w-3.5 h-3.5" />
              THE CLASSIC DEADLOCK
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#1B1F3B] leading-tight">
              &ldquo;It works on <span className="marker">my machine.</span>&rdquo;
            </h2>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#6EE7B7]/20 border-3 border-[#1B1F3B] rounded-xl">
                <div className="font-display font-bold text-sm text-[#1B1F3B]">Sam&apos;s Laptop</div>
                <div className="font-mono text-[11px] text-[#1B1F3B]/70 mt-0.5">200 hidden configs = Works</div>
              </div>
              <div className="p-4 bg-[#FF5C7A]/20 border-3 border-[#1B1F3B] rounded-xl">
                <div className="font-display font-bold text-sm text-[#1B1F3B]">Priya&apos;s Laptop</div>
                <div className="font-mono text-[11px] text-[#1B1F3B]/70 mt-0.5">Clean OS = Crashes</div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 21: Anatomy of App */}
        {slide.interactiveType === "anatomy_of_app" && (
          <div className="space-y-2 max-w-xl mx-auto w-full my-auto font-display font-bold text-xs sm:text-sm">
            <div className="p-3 bg-[#FF6B35] text-white rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
              1. Application Source Code (Only 10%!)
            </div>
            <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
              2. Language Runtime (Node.js 20.10)
            </div>
            <div className="p-3 bg-[#FFC93C] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
              3. Dependencies & node_modules (780 Packages)
            </div>
            <div className="p-3 bg-[#6EE7B7] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
              4. System Shared Libraries (glibc, libssl, ImageMagick)
            </div>
            <div className="p-3 bg-[#1B1F3B] text-white rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
              5. Environment Variables & OS Configurations
            </div>
          </div>
        )}

        {/* SLIDE 22: Package Idea */}
        {slide.interactiveType === "package_idea" && (
          <div className="card-brut bg-[#FFF8F0] p-6 text-center space-y-4 max-w-lg mx-auto my-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center border-3 border-[#1B1F3B] shadow-[4px_4px_0_#1B1F3B]">
              <Box className="w-7 h-7" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">
              Package the Entire Execution Envelope
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#1B1F3B]/80">
              Don&apos;t just send code over git. Send the code, the exact runtime, pre-built binaries, and configuration packed in a sealed box.
            </p>
          </div>
        )}

        {/* SLIDE 23: Container Architecture */}
        {slide.interactiveType === "container_architecture" && (
          <div className="card-brut bg-white p-5 space-y-3 text-center max-w-xl mx-auto my-auto">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FF6B35] text-white rounded-xl border-2 border-[#1B1F3B]">
                <div className="font-display font-bold text-xs">Container A</div>
                <div className="font-mono text-[10px]">Node 20</div>
              </div>
              <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B]">
                <div className="font-display font-bold text-xs">Container B</div>
                <div className="font-mono text-[10px]">Node 18</div>
              </div>
              <div className="p-3 bg-[#6EE7B7] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B]">
                <div className="font-display font-bold text-xs">Container C</div>
                <div className="font-mono text-[10px]">Redis 7</div>
              </div>
            </div>
            <div className="font-display font-extrabold text-lg text-[#1B1F3B]">↓</div>
            <div className="p-3.5 bg-[#1B1F3B] text-white rounded-xl border-2 border-[#1B1F3B]">
              <div className="font-display font-extrabold text-sm">Single Shared Host OS Kernel</div>
              <div className="font-mono text-[10px] text-[#FFF8F0]/70 mt-0.5">
                Linux cgroups (resource limits) + namespaces (process isolation)
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 24: Docker Intro */}
        {slide.interactiveType === "docker_intro" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4EA8FF] text-[#1B1F3B] border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              Standard of the Software Industry
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-[#1B1F3B]">
              DOCKER
            </h2>
            <div className="font-display font-extrabold text-xl text-[#FF6B35]">
              Build Once. Ship Anywhere. Run Consistently.
            </div>
          </div>
        )}

        {/* SLIDE 25: Docker Image Box */}
        {slide.interactiveType === "docker_image_box" && (
          <div className="max-w-lg mx-auto w-full my-auto p-5 bg-[#FFF8F0] border-4 border-[#1B1F3B] rounded-2xl shadow-[5px_5px_0_#1B1F3B] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-[#1B1F3B] pb-2">
              <div className="flex items-center gap-2 font-display font-extrabold text-lg text-[#1B1F3B]">
                <Box className="w-5 h-5 text-[#FF6B35]" />
                Docker Image: lehar/loom:1.0
              </div>
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[10px]">Immutable</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-2.5 bg-white border-2 border-[#1B1F3B] rounded-lg">✓ App Source Code</div>
              <div className="p-2.5 bg-white border-2 border-[#1B1F3B] rounded-lg">✓ Node.js Runtime</div>
              <div className="p-2.5 bg-white border-2 border-[#1B1F3B] rounded-lg">✓ Locked Deps</div>
              <div className="p-2.5 bg-white border-2 border-[#1B1F3B] rounded-lg">✓ System Libraries</div>
            </div>
          </div>
        )}

        {/* SLIDE 26: Docker Container Instances */}
        {slide.interactiveType === "docker_container_instances" && (
          <div className="card-brut bg-white p-5 space-y-3 text-center max-w-lg mx-auto my-auto">
            <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] border-3 border-[#1B1F3B] rounded-xl font-display font-extrabold text-sm shadow-[3px_3px_0_#1B1F3B]">
              Docker Image (The Blueprint)
            </div>
            <div className="font-display font-extrabold text-lg text-[#1B1F3B]">↓ $ docker run</div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-[#6EE7B7] border-2 border-[#1B1F3B] rounded-lg font-mono text-xs font-bold text-[#1B1F3B]">
                Container #1 (:3000)
              </div>
              <div className="p-3 bg-[#6EE7B7] border-2 border-[#1B1F3B] rounded-lg font-mono text-xs font-bold text-[#1B1F3B]">
                Container #2 (:3001)
              </div>
              <div className="p-3 bg-[#6EE7B7] border-2 border-[#1B1F3B] rounded-lg font-mono text-xs font-bold text-[#1B1F3B]">
                Container #3 (:3002)
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 27: Hundred Containers */}
        {slide.interactiveType === "hundred_containers" && (
          <div className="card-brut bg-white p-4 space-y-2 my-auto">
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const labels = ["API", "Web", "DB", "Redis", "Auth", "Worker"];
                const label = labels[i % labels.length];
                return (
                  <div key={i} className="p-1.5 bg-[#FFF8F0] border border-[#1B1F3B] rounded-lg text-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7] mx-auto mb-0.5" />
                    <div className="font-mono text-[9px] font-bold text-[#1B1F3B] truncate">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SLIDE 28: Sam Regret Chaos */}
        {slide.interactiveType === "sam_regret_chaos" && (
          <div className="card-brut bg-white p-4 sm:p-6 space-y-3 my-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 relative h-[200px] sm:h-[240px] md:h-[270px] rounded-2xl overflow-hidden border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B]">
                <Image
                  src="/assets/sam_chaos.jpg"
                  alt="Sam Container Chaos"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="md:col-span-5 space-y-2">
                <span className="chip-mono bg-[#FF5C7A] text-white text-[10px]">ORCHESTRATION EMERGENCY</span>
                <h3 className="font-display font-extrabold text-2xl text-[#1B1F3B]">
                  Managing Fleets by Hand is Impossible
                </h3>
                <p className="font-sans text-xs text-[#1B1F3B]/80 leading-relaxed">
                  How do containers discover each other? What handles load balancing? What restarts dead services at 3 AM?
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 29: Kubernetes Intro */}
        {slide.interactiveType === "kubernetes_intro" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4EA8FF] text-[#1B1F3B] border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              Container Fleet Orchestration
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-[#1B1F3B]">
              KUBERNETES
            </h2>
            <p className="font-display font-bold text-base sm:text-lg text-[#FF6B35]">
              Docker helps run containers. Kubernetes helps manage them across thousands of servers.
            </p>
          </div>
        )}

        {/* SLIDE 30: K8s Self Healing Sim */}
        {slide.interactiveType === "k8s_self_healing_sim" && <KubernetesClusterSim />}

        {/* SLIDE 31: Daily Release Pressure */}
        {slide.interactiveType === "daily_release_pressure" && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-auto">
            {[
              { day: "Monday", event: "Checkout Feature", color: "bg-[#FF6B35] text-white" },
              { day: "Tuesday", event: "Diwali Promo", color: "bg-[#FFC93C] text-[#1B1F3B]" },
              { day: "Wednesday", event: "Candles Upsell", color: "bg-[#4EA8FF] text-[#1B1F3B]" },
              { day: "Thursday", event: "Gateway Fix", color: "bg-[#6EE7B7] text-[#1B1F3B]" },
              { day: "Friday 5PM", event: '“Small Change” 💀', color: "bg-[#FF5C7A] text-white" },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
                <span className={`chip-mono text-[9px] ${item.color}`}>{item.day}</span>
                <h4 className="font-display font-bold text-sm text-[#1B1F3B]">{item.event}</h4>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 32: Manual Deploy Pain */}
        {slide.interactiveType === "manual_deploy_pain" && (
          <div className="max-w-md mx-auto w-full my-auto space-y-2 font-mono text-xs text-center">
            <div className="p-3 bg-white border-2 border-[#1B1F3B] rounded-xl shadow-[2px_2px_0_#1B1F3B]">1. npm test (Did Sam remember?)</div>
            <div className="p-3 bg-white border-2 border-[#1B1F3B] rounded-xl shadow-[2px_2px_0_#1B1F3B]">2. docker build -t lehar:v4 .</div>
            <div className="p-3 bg-white border-2 border-[#1B1F3B] rounded-xl shadow-[2px_2px_0_#1B1F3B]">3. ssh root@production-server</div>
            <div className="p-3 bg-white border-2 border-[#1B1F3B] rounded-xl shadow-[2px_2px_0_#1B1F3B]">4. docker stop && docker run ...</div>
          </div>
        )}

        {/* SLIDE 33: CI/CD Pipeline Sim */}
        {slide.interactiveType === "cicd_pipeline_sim" && <CicdPipelineVisualizer />}

        {/* SLIDE 34: CI Flow */}
        {slide.interactiveType === "ci_flow" && (
          <div className="card-brut bg-white p-6 space-y-3 text-center max-w-lg mx-auto my-auto">
            <div className="p-3.5 bg-[#4EA8FF] text-[#1B1F3B] font-display font-extrabold text-base rounded-xl border-2 border-[#1B1F3B]">
              Developer Git Push / PR
            </div>
            <div className="font-extrabold text-lg text-[#1B1F3B]">↓ Triggers Automated Runner</div>
            <div className="p-3.5 bg-[#6EE7B7] text-[#1B1F3B] font-display font-extrabold text-base rounded-xl border-2 border-[#1B1F3B]">
              Automated Test Suite Passed (248 Tests)
            </div>
          </div>
        )}

        {/* SLIDE 35: CD Flow */}
        {slide.interactiveType === "cd_flow" && (
          <div className="card-brut bg-white p-6 space-y-3 text-center max-w-lg mx-auto my-auto">
            <div className="p-3.5 bg-[#6EE7B7] text-[#1B1F3B] font-display font-extrabold text-base rounded-xl border-2 border-[#1B1F3B]">
              Tests Passed on Main Branch
            </div>
            <div className="font-extrabold text-lg text-[#1B1F3B]">↓ Build & Tag Container</div>
            <div className="p-3.5 bg-[#FF6B35] text-white font-display font-extrabold text-base rounded-xl border-2 border-[#1B1F3B]">
              Zero-Downtime Deploy to Kubernetes / Cloud
            </div>
          </div>
        )}

        {/* SLIDE 36: GitHub Actions Engine */}
        {slide.interactiveType === "github_actions_engine" && (
          <div className="max-w-xl mx-auto w-full my-auto p-4 bg-[#1B1F3B] text-[#FFF8F0] border-3 border-[#1B1F3B] rounded-2xl shadow-[5px_5px_0_#1B1F3B]">
            <div className="font-mono text-xs text-[#6EE7B7] font-bold border-b border-[#FFF8F0]/20 pb-1.5 mb-2">
              .github/workflows/deploy.yml
            </div>
            <pre className="font-mono text-xs leading-relaxed text-[#FFF8F0]/90 overflow-x-auto">
{`on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t lehar/app:latest .
      - run: kubectl set image deployment/web web=lehar/app:latest`}
            </pre>
          </div>
        )}

        {/* SLIDE 37: Cloud Infra Sprawl */}
        {slide.interactiveType === "cloud_infra_sprawl" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-auto">
            {[
              { name: "VPC & Subnets", icon: <Network className="w-5 h-5" /> },
              { name: "EC2 & EKS", icon: <Server className="w-5 h-5" /> },
              { name: "Load Balancer", icon: <Share2 className="w-5 h-5" /> },
              { name: "RDS Postgres", icon: <Database className="w-5 h-5" /> },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1.5">
                <div className="p-2 bg-[#FF6B35] text-white rounded-lg inline-block">{item.icon}</div>
                <h4 className="font-display font-bold text-sm text-[#1B1F3B]">{item.name}</h4>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 38: ClickOps Nightmare */}
        {slide.interactiveType === "clickops_nightmare" && (
          <div className="card-brut bg-[#FF5C7A]/15 p-6 text-center space-y-3 max-w-xl mx-auto my-auto">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1B1F3B]">
              &ldquo;Sam, recreate production in Mumbai.&rdquo;
            </h3>
            <p className="font-sans text-xs sm:text-sm max-w-md mx-auto text-[#1B1F3B]/80">
              Can anyone remember all 142 checkboxes, port allowances, and security groups configured over the last two years?
            </p>
          </div>
        )}

        {/* SLIDE 39: Terraform IaC */}
        {slide.interactiveType === "terraform_iac" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6EE7B7] text-[#1B1F3B] border-2 border-[#1B1F3B] rounded-full font-mono text-xs font-bold shadow-[2px_2px_0_#1B1F3B]">
              Infrastructure as Code
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-[#1B1F3B]">
              TERRAFORM
            </h2>
            <p className="font-display font-bold text-base sm:text-lg text-[#FF6B35]">
              Don&apos;t click cloud resources. Write them in declarative code and version control them.
            </p>
          </div>
        )}

        {/* SLIDE 40: ClickOps vs Code */}
        {slide.interactiveType === "clickops_vs_code" && <TerraformClickOpsVsCode />}

        {/* SLIDE 41: DevOps Ecosystem Map */}
        {slide.interactiveType === "devops_ecosystem_map" && (
          <div className="card-brut bg-white p-5 space-y-4 text-center max-w-2xl mx-auto my-auto">
            <div className="p-3 bg-[#FF6B35] text-white font-display font-extrabold text-lg rounded-xl border-3 border-[#1B1F3B] max-w-xs mx-auto">
              DEVOPS
            </div>
            <div className="font-display font-extrabold text-lg text-[#1B1F3B]">↓</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#4EA8FF] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] space-y-0.5">
                <div className="font-display font-extrabold text-base">Docker</div>
                <div className="font-mono text-[10px]">Containers</div>
                <div className="font-mono text-xs font-bold pt-1">→ Kubernetes</div>
              </div>
              <div className="p-3.5 bg-[#6EE7B7] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] space-y-0.5">
                <div className="font-display font-extrabold text-base">CI / CD</div>
                <div className="font-mono text-[10px]">Automation</div>
                <div className="font-mono text-xs font-bold pt-1">→ GitHub Actions</div>
              </div>
              <div className="p-3.5 bg-[#FFC93C] text-[#1B1F3B] rounded-xl border-2 border-[#1B1F3B] space-y-0.5">
                <div className="font-display font-extrabold text-base">Terraform</div>
                <div className="font-mono text-[10px]">Infrastructure</div>
                <div className="font-mono text-xs font-bold pt-1">→ Cloud Fleet</div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 42: Full Journey Cinematic */}
        {slide.interactiveType === "full_journey_cinematic" && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center my-auto">
            {[
              { step: "1. Dev", tool: "VS Code", color: "bg-white" },
              { step: "2. Push", tool: "GitHub", color: "bg-white" },
              { step: "3. CI/CD", tool: "Actions", color: "bg-[#FFC93C]/40" },
              { step: "4. Package", tool: "Docker", color: "bg-[#FF6B35] text-white" },
              { step: "5. Scale", tool: "Kubernetes", color: "bg-[#4EA8FF]" },
              { step: "6. Cloud", tool: "Terraform", color: "bg-[#6EE7B7]" },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B] ${item.color}`}>
                <span className="font-display font-bold text-[11px] block text-[#1B1F3B]">{item.step}</span>
                <strong className="font-display font-extrabold text-xs block mt-0.5">{item.tool}</strong>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 43: DevOps Infinity Loop */}
        {slide.interactiveType === "devops_infinity_loop" && <DevOpsLoopDiagram />}

        {/* SLIDE 44: Four Pillar Cards */}
        {slide.interactiveType === "four_pillar_cards" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-auto">
            {[
              { title: "Docker", desc: "Package & run applications consistently.", color: "bg-[#FF6B35] text-white" },
              { title: "Kubernetes", desc: "Manage & scale container fleets.", color: "bg-[#4EA8FF] text-[#1B1F3B]" },
              { title: "CI / CD", desc: "Automate testing and releases.", color: "bg-[#6EE7B7] text-[#1B1F3B]" },
              { title: "Terraform", desc: "Infrastructure as Code.", color: "bg-[#FFC93C] text-[#1B1F3B]" },
            ].map((pillar, idx) => (
              <div key={idx} className="p-4 bg-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-2 flex flex-col justify-between">
                <div>
                  <span className={`chip-mono text-[9px] ${pillar.color}`}>{pillar.title}</span>
                  <h4 className="font-display font-extrabold text-lg text-[#1B1F3B] mt-1">{pillar.title}</h4>
                  <p className="font-sans text-xs text-[#1B1F3B]/80 mt-1">{pillar.desc}</p>
                </div>
                <div className="pt-2 border-t border-[#1B1F3B]/10 font-mono text-[10px] text-[#1B1F3B]/50 font-bold uppercase">
                  Pillar #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 45: GitHub Actions Role */}
        {slide.interactiveType === "github_actions_role" && (
          <div className="card-brut bg-white p-6 space-y-3 text-center max-w-lg mx-auto my-auto">
            <div className="p-3 bg-[#FFC93C] border-2 border-[#1B1F3B] rounded-xl font-display font-extrabold text-base text-[#1B1F3B]">
              GitHub Repository (Code)
            </div>
            <div className="font-display font-extrabold text-lg text-[#1B1F3B]">↓ Automation Triggers</div>
            <div className="p-4 bg-[#1B1F3B] text-white border-3 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-1">
              <div className="font-display font-extrabold text-xl text-[#6EE7B7]">GitHub Actions Workflow</div>
              <div className="font-mono text-xs text-[#FFF8F0]/70">Executes automated tests, builds Docker image, deploys to cluster</div>
            </div>
          </div>
        )}

        {/* SLIDE 46: DevOps Not Docker */}
        {slide.interactiveType === "devops_not_docker" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto my-auto">
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-[#1B1F3B]">
              DevOps ≠ Docker
            </h2>
            <p className="font-sans text-sm sm:text-base max-w-md mx-auto text-[#1B1F3B]/80">
              DevOps is the entire manufacturing factory and engineering culture. Docker is the standardized shipping container that makes modern factories possible.
            </p>
          </div>
        )}

        {/* SLIDE 47: Zoom In Docker */}
        {slide.interactiveType === "zoom_in_docker" && (
          <div className="card-brut bg-[#1B1F3B] text-white p-6 sm:p-10 text-center space-y-4 max-w-lg mx-auto my-auto">
            <span className="chip-mono bg-[#FF6B35] text-white text-[10px]">FOCUS FOR TODAY</span>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white">
              We Zoom In.
            </h2>
            <p className="font-sans text-sm text-[#FFF8F0]/70 max-w-md mx-auto">
              Now that you understand the entire DevOps map, the rest of this workshop is dedicated to mastering containerization with Docker.
            </p>
          </div>
        )}

        {/* SLIDE 48: Docker Radar Topics */}
        {slide.interactiveType === "docker_radar_topics" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center my-auto">
            {[
              "Images",
              "Containers",
              "Dockerfile",
              "Networking",
              "Volumes",
              "Compose",
            ].map((topic, idx) => (
              <div key={idx} className="p-4 bg-white border-3 border-[#1B1F3B] rounded-xl shadow-[3px_3px_0_#1B1F3B] space-y-1">
                <span className="chip-mono text-[8px] bg-[#FF6B35] text-white">Topic {idx + 1}</span>
                <h4 className="font-display font-extrabold text-sm text-[#1B1F3B]">{topic}</h4>
              </div>
            ))}
          </div>
        )}

        {/* SLIDE 49: Docker Run Terminal */}
        {slide.interactiveType === "docker_run_terminal" && (
          <div className="my-auto max-w-2xl mx-auto w-full">
            <TerminalSimulator
              initialCommand="docker run -d -p 80:80 --name lehar-web nginx:alpine"
              outputLines={[
                { text: "Unable to find image 'nginx:alpine' locally", type: "dim" },
                { text: "alpine: Pulling from library/nginx", type: "highlight" },
                { text: "Status: Downloaded newer image for nginx:alpine", type: "success" },
                { text: "c82b45e9fa014389df0b62e4975583b2767098e9821a8d (Container Running)", type: "highlight" },
                { text: "✓ Nginx web server live at http://localhost:80", type: "success" },
              ]}
            />
          </div>
        )}

        {/* SLIDE 50: Welcome Build Start */}
        {slide.interactiveType === "welcome_build_start" && (
          <div className="card-brut bg-white p-6 sm:p-8 text-center space-y-5 max-w-lg mx-auto my-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#6EE7B7] text-[#1B1F3B] flex items-center justify-center border-3 border-[#1B1F3B] shadow-[4px_4px_0_#1B1F3B]">
              <Rocket className="w-7 h-7" />
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1B1F3B]">
              Welcome to Docker. Let&apos;s build something.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#1B1F3B]/80">
              No more &ldquo;works on my machine&rdquo;. Time to open your code editors and terminals for hands-on Docker exercises!
            </p>
            <button
              onClick={() => {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }}
              className="tactile-btn tactile-btn-primary px-6 py-2.5 text-sm"
            >
              🎉 Start Hands-On Labs!
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
