"use client";

import React, { useState } from "react";
import { GitCommit, Hammer, CheckSquare, Box, Rocket, Play, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface Stage {
  name: string;
  desc: string;
  icon: React.ReactNode;
}

export function CicdPipelineVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const stages: Stage[] = [
    { name: "Git Push", desc: "Merged to main", icon: <GitCommit className="w-4 h-4" /> },
    { name: "Build", desc: "Compile assets", icon: <Hammer className="w-4 h-4" /> },
    { name: "Test Suite", desc: "248 tests pass", icon: <CheckSquare className="w-4 h-4" /> },
    { name: "Docker Build", desc: "Package image", icon: <Box className="w-4 h-4" /> },
    { name: "Deploy", desc: "Rollout to Prod", icon: <Rocket className="w-4 h-4" /> },
  ];

  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);

    const stepInterval = (step: number) => {
      if (step < stages.length - 1) {
        setTimeout(() => {
          setCurrentStep(step + 1);
          stepInterval(step + 1);
        }, 700);
      } else {
        setTimeout(() => {
          setIsRunning(false);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }, 600);
      }
    };

    stepInterval(0);
  };

  const resetPipeline = () => {
    setCurrentStep(-1);
    setIsRunning(false);
  };

  return (
    <div className="w-full card-brut bg-white p-4 md:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <span className="chip-mono bg-[#FFC93C] text-[#1B1F3B] text-[10px]">Automation Engine</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            Automated CI/CD Delivery Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="tactile-btn tactile-btn-primary px-3 py-1.5 text-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            {isRunning ? "Running..." : "Trigger Pipeline"}
          </button>
          <button
            onClick={resetPipeline}
            disabled={isRunning || currentStep === -1}
            className="tactile-btn tactile-btn-secondary p-1.5 text-xs"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pipeline Steps Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {stages.map((stage, idx) => {
          const isPassed = currentStep > idx;
          const isCurrent = currentStep === idx;
          const isPending = currentStep < idx;

          let cardBorder = "border-[#1B1F3B] bg-[#FFF8F0]";
          let badgeColor = "bg-[#1B1F3B]/10 text-[#1B1F3B]";
          let badgeText = "WAITING";

          if (isCurrent) {
            cardBorder = "border-[#FF6B35] bg-[#FF6B35]/10 animate-pulse";
            badgeColor = "bg-[#FF6B35] text-white";
            badgeText = "EXECUTING...";
          } else if (isPassed) {
            cardBorder = "border-[#1B1F3B] bg-[#6EE7B7]/20";
            badgeColor = "bg-[#6EE7B7] text-[#1B1F3B]";
            badgeText = "✓ PASSED";
          }

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border-3 ${cardBorder} shadow-[3px_3px_0_#1B1F3B] flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg border-2 border-[#1B1F3B] ${isPassed ? "bg-[#6EE7B7]" : isCurrent ? "bg-[#FF6B35] text-white" : "bg-white"}`}>
                    {stage.icon}
                  </div>
                  <span className={`chip-mono text-[8px] px-1.5 py-0.2 ${badgeColor}`}>
                    {badgeText}
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1F3B]">
                  {idx + 1}. {stage.name}
                </h4>
                <p className="font-sans text-[11px] text-[#1B1F3B]/70 mt-0.5">
                  {stage.desc}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-[#1B1F3B]/10 font-mono text-[9px] text-[#1B1F3B]/50">
                {isPassed && "Done in 1.4s"}
                {isCurrent && "Running..."}
                {isPending && "Queued"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary Bar */}
      <div className="p-3 bg-[#F5EBE0] border-3 border-[#1B1F3B] rounded-xl flex items-center justify-between font-mono text-xs text-[#1B1F3B]">
        <span className="truncate mr-2">
          <strong>Status:</strong>{" "}
          {currentStep === -1
            ? "Ready to run. Click 'Trigger Pipeline'."
            : currentStep === 4 && !isRunning
            ? "🎉 Deployed to Production successfully in 4.8s!"
            : `Step ${currentStep + 1} of 5 running...`}
        </span>
        <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[10px] shrink-0">
          GitHub Actions
        </span>
      </div>
    </div>
  );
}
