"use client";

import React, { useState } from "react";
import { Server, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

interface Pod {
  id: string;
  name: string;
  image: string;
  status: "running" | "crashed" | "recovering";
  restarts: number;
}

export function KubernetesClusterSim() {
  const [pods, setPods] = useState<Pod[]>([
    { id: "pod-1", name: "loom-frontend-8f4b", image: "lehar/frontend:v1.2", status: "running", restarts: 0 },
    { id: "pod-2", name: "loom-backend-2c9a", image: "lehar/api:v1.2", status: "running", restarts: 0 },
    { id: "pod-3", name: "candles-shop-7d1e", image: "candles/web:v1.0", status: "running", restarts: 0 },
    { id: "pod-4", name: "redis-cache-4a3f", image: "redis:7.2-alpine", status: "running", restarts: 0 },
  ]);
  const [logMessage, setLogMessage] = useState<string>("Cluster status: HEALTHY. Desired replicas: 4 / 4.");

  const crashPod = (id: string) => {
    setPods((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "crashed" } : p))
    );
    setLogMessage(`⚠️ [K8s Controller] Pod ${id} crashed! Reconciling desired state (4) vs actual state (3)...`);

    // Self heal after 1.4 seconds
    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "recovering" } : p))
      );
      setLogMessage(`🔄 [K8s Scheduler] Spawning replacement pod on Node-01...`);

      setTimeout(() => {
        setPods((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, status: "running", restarts: p.restarts + 1, id: `pod-${Math.floor(Math.random() * 9000 + 1000)}` }
              : p
          )
        );
        setLogMessage(`✅ [K8s Kubelet] Pod revived & healthy! Self-healing completed automatically.`);
      }, 1200);
    }, 1400);
  };

  return (
    <div className="w-full card-brut bg-white p-4 md:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[10px]">K8s Control Plane</span>
            <span className="font-mono text-[11px] text-[#1B1F3B]/70 font-bold">Node: worker-01</span>
          </div>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            Interactive Self-Healing Pod Simulation
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#6EE7B7] border-2 border-[#1B1F3B] rounded-lg font-mono text-[11px] font-bold text-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Desired: 4 / 4 Running
        </div>
      </div>

      <p className="font-sans text-xs text-[#1B1F3B]/80">
        👉 <strong className="text-[#FF6B35]">Click any pod below to crash it</strong>. Watch K8s auto-reconcile and revive a new healthy container!
      </p>

      {/* Pods Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {pods.map((pod) => {
          const isRunning = pod.status === "running";
          const isCrashed = pod.status === "crashed";
          const isRecovering = pod.status === "recovering";

          let borderBg = "border-[#1B1F3B] bg-[#FFF8F0]";
          if (isCrashed) borderBg = "border-[#FF5C7A] bg-[#FF5C7A]/15 animate-shake";
          if (isRecovering) borderBg = "border-[#FFC93C] bg-[#FFC93C]/20 animate-pulse";

          return (
            <div
              key={pod.id}
              onClick={() => isRunning && crashPod(pod.id)}
              className={`p-3 rounded-xl border-3 ${borderBg} shadow-[3px_3px_0_#1B1F3B] transition-all cursor-pointer select-none hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="p-1.5 bg-[#1B1F3B] text-white rounded-lg">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`chip-mono text-[9px] px-1.5 py-0.2 ${
                    isRunning
                      ? "bg-[#6EE7B7] text-[#1B1F3B]"
                      : isCrashed
                      ? "bg-[#FF5C7A] text-white"
                      : "bg-[#FFC93C] text-[#1B1F3B]"
                  }`}
                >
                  {isRunning && "● RUNNING"}
                  {isCrashed && "✖ CRASHED"}
                  {isRecovering && "◌ HEALING"}
                </span>
              </div>

              <div className="font-mono text-xs font-bold text-[#1B1F3B] truncate">{pod.name}</div>
              <div className="font-mono text-[10px] text-[#1B1F3B]/60 truncate">{pod.image}</div>

              <div className="mt-2 pt-1.5 border-t border-[#1B1F3B]/20 flex items-center justify-between text-[10px] font-mono font-bold">
                <span className="text-[#1B1F3B]/60">Restarts:</span>
                <span className={pod.restarts > 0 ? "text-[#FF6B35]" : "text-[#1B1F3B]"}>{pod.restarts}</span>
              </div>

              {isRunning && (
                <div className="mt-1.5 text-[9px] font-mono text-[#FF5C7A] text-center font-bold uppercase tracking-wider bg-white/90 py-0.5 rounded border border-[#1B1F3B]/30">
                  Click to Kill
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controller Log Bar */}
      <div className="bg-[#1B1F3B] text-[#FFF8F0] px-3.5 py-2.5 rounded-xl border-3 border-[#1B1F3B] shadow-[3px_3px_0_#1B1F3B] flex items-center gap-2 font-mono text-[11px]">
        <RefreshCw className="w-3.5 h-3.5 text-[#4EA8FF] shrink-0 animate-spin" />
        <span className="truncate">{logMessage}</span>
      </div>
    </div>
  );
}
