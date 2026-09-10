"use client";

import React, { useState } from "react";
import { Compass, Code2, Hammer, CheckCheck, Package, Rocket, Activity, Gauge } from "lucide-react";

interface LoopStage {
  id: string;
  name: string;
  role: string;
  tools: string;
  color: string;
  icon: React.ReactNode;
}

export function DevOpsLoopDiagram() {
  const stages: LoopStage[] = [
    { id: "plan", name: "Plan", role: "Define roadmaps, issues & sprint requirements", tools: "Jira, Linear, GitHub Projects", color: "bg-[#4EA8FF]", icon: <Compass className="w-4 h-4" /> },
    { id: "code", name: "Code", role: "Write features, fix bugs & create PRs", tools: "VS Code, Git, GitHub", color: "bg-[#6EE7B7]", icon: <Code2 className="w-4 h-4" /> },
    { id: "build", name: "Build", role: "Compile code & build immutable Docker images", tools: "Docker, Vite, Next.js", color: "bg-[#FF6B35] text-white", icon: <Hammer className="w-4 h-4" /> },
    { id: "test", name: "Test", role: "Run unit, integration & security vulnerability checks", tools: "Jest, Playwright, SonarQube", color: "bg-[#FFC93C]", icon: <CheckCheck className="w-4 h-4" /> },
    { id: "release", name: "Release", role: "Tag versions & push container to registry", tools: "GitHub Releases, Docker Hub", color: "bg-[#4EA8FF]", icon: <Package className="w-4 h-4" /> },
    { id: "deploy", name: "Deploy", role: "Roll out to production with zero downtime", tools: "Kubernetes, ArgoCD, Helm", color: "bg-[#FF5C7A] text-white", icon: <Rocket className="w-4 h-4" /> },
    { id: "operate", name: "Operate", role: "Manage cloud infrastructure & scaling policies", tools: "Terraform, AWS, GCP", color: "bg-[#FF6B35] text-white", icon: <Activity className="w-4 h-4" /> },
    { id: "monitor", name: "Monitor", role: "Track metrics, traces, APM errors & user feedback", tools: "Prometheus, Grafana, Datadog", color: "bg-[#6EE7B7]", icon: <Gauge className="w-4 h-4" /> },
  ];

  const [activeStage, setActiveStage] = useState<LoopStage>(stages[2]); // Default on Build/Docker

  return (
    <div className="w-full card-brut bg-white p-4 md:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[10px]">Continuous Lifecycle</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            The DevOps Infinity Feedback Loop
          </h3>
        </div>
        <span className="font-mono text-[11px] text-[#1B1F3B]/70 font-bold">
          Click any stage to inspect
        </span>
      </div>

      {/* 8-Stage Grid / Pill selector */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {stages.map((stage) => {
          const isSelected = activeStage.id === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage)}
              className={`p-3 rounded-2xl border-3 border-[#1B1F3B] text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? `${stage.color} shadow-[4px_4px_0_#1B1F3B] -translate-y-1 font-extrabold scale-105`
                  : "bg-[#FFF8F0] text-[#1B1F3B] hover:bg-white shadow-[2px_2px_0_#1B1F3B]"
              }`}
            >
              {stage.icon}
              <span className="font-display font-bold text-xs">{stage.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      <div className="p-6 bg-[#F5EBE0] border-4 border-[#1B1F3B] rounded-2xl shadow-[6px_6px_0_#1B1F3B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`chip-mono ${activeStage.color}`}>
              Stage: {activeStage.name}
            </span>
          </div>
          <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">
            {activeStage.role}
          </h4>
        </div>

        <div className="bg-white p-3.5 border-2 border-[#1B1F3B] rounded-xl font-mono text-xs text-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
          <span className="text-[#1B1F3B]/60 block text-[10px] font-bold uppercase tracking-wider">
            Common Industry Tools
          </span>
          <strong className="text-[#FF6B35] text-sm mt-0.5 block">{activeStage.tools}</strong>
        </div>
      </div>
    </div>
  );
}
