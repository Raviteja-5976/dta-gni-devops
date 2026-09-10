"use client";

import React, { useState } from "react";
import { Layers, HardDrive, Cpu, Zap } from "lucide-react";

export function VmVsContainerDiagram() {
  const [viewMode, setViewMode] = useState<"architecture" | "resource">("architecture");

  return (
    <div className="w-full card-brut bg-white p-4 md:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B] text-[10px]">Architectural Comparison</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            Virtual Machines vs. Docker Containers
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("architecture")}
            className={`tactile-btn px-3 py-1 text-xs ${
              viewMode === "architecture" ? "tactile-btn-primary" : "tactile-btn-secondary"
            }`}
          >
            <Layers className="w-3 h-3" />
            Layers
          </button>
          <button
            onClick={() => setViewMode("resource")}
            className={`tactile-btn px-3 py-1 text-xs ${
              viewMode === "resource" ? "tactile-btn-primary" : "tactile-btn-secondary"
            }`}
          >
            <Zap className="w-3 h-3" />
            RAM Impact
          </button>
        </div>
      </div>

      {viewMode === "architecture" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Virtual Machines Side */}
          <div className="p-5 bg-[#FFF8F0] border-4 border-[#1B1F3B] rounded-2xl shadow-[6px_6px_0_#1B1F3B] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-extrabold text-lg text-[#1B1F3B]">Virtual Machines</h4>
              <span className="chip-mono bg-[#FF5C7A] text-white">Heavyweight</span>
            </div>
            <p className="font-sans text-xs text-[#1B1F3B]/70">
              Each VM virtualizes full physical hardware and runs an entire Guest OS.
            </p>

            <div className="space-y-1.5 pt-2 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#FF6B35] text-white font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  App 1
                </div>
                <div className="p-2.5 bg-[#4EA8FF] text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  App 2
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#F5EBE0] text-[#1B1F3B] text-center rounded-xl border-2 border-[#1B1F3B]">
                  Libs / Deps
                </div>
                <div className="p-2 bg-[#F5EBE0] text-[#1B1F3B] text-center rounded-xl border-2 border-[#1B1F3B]">
                  Libs / Deps
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#FF5C7A]/20 text-[#FF5C7A] font-bold text-center rounded-xl border-2 border-[#FF5C7A]">
                  Guest OS (4GB)
                </div>
                <div className="p-3 bg-[#FF5C7A]/20 text-[#FF5C7A] font-bold text-center rounded-xl border-2 border-[#FF5C7A]">
                  Guest OS (4GB)
                </div>
              </div>
              <div className="p-2.5 bg-[#FFC93C] text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                Hypervisor (Type 1 / 2)
              </div>
              <div className="p-2.5 bg-[#1B1F3B] text-white font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                Host OS & Physical Server
              </div>
            </div>
          </div>

          {/* Docker Containers Side */}
          <div className="p-5 bg-[#FFF8F0] border-4 border-[#1B1F3B] rounded-2xl shadow-[6px_6px_0_#1B1F3B] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-extrabold text-lg text-[#1B1F3B]">Docker Containers</h4>
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B]">Lightweight</span>
            </div>
            <p className="font-sans text-xs text-[#1B1F3B]/70">
              Containers share the host OS kernel via Linux namespaces & cgroups.
            </p>

            <div className="space-y-1.5 pt-2 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#FF6B35] text-white font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  Container 1 (App)
                </div>
                <div className="p-2.5 bg-[#4EA8FF] text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  Container 2 (App)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-[#6EE7B7]/30 text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  Bin / Libs (20MB)
                </div>
                <div className="p-2 bg-[#6EE7B7]/30 text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                  Bin / Libs (20MB)
                </div>
              </div>
              <div className="p-3 bg-[#4EA8FF] text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B] shadow-[2px_2px_0_#1B1F3B]">
                Docker Engine (Daemon)
              </div>
              <div className="p-2.5 bg-[#6EE7B7] text-[#1B1F3B] font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                Shared Host OS Kernel
              </div>
              <div className="p-2.5 bg-[#1B1F3B] text-white font-bold text-center rounded-xl border-2 border-[#1B1F3B]">
                Host Hardware / Infrastructure
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Resource Comparison Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#FF5C7A]/10 border-4 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-4">
            <h4 className="font-display font-extrabold text-xl text-[#1B1F3B] flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#FF5C7A]" />
              10 Applications via VMs
            </h4>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Operating Systems:</span>
                <strong className="text-[#FF5C7A]">10 full copies of Ubuntu</strong>
              </div>
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Memory Overhead:</span>
                <strong className="text-[#FF5C7A]">~40 GB RAM</strong>
              </div>
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Cold Boot Time:</span>
                <strong className="text-[#FF5C7A]">60 – 180 seconds</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1B1F3B]/70">Disk Footprint:</span>
                <strong className="text-[#FF5C7A]">~200 GB</strong>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#6EE7B7]/15 border-4 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] space-y-4">
            <h4 className="font-display font-extrabold text-xl text-[#1B1F3B] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#1B1F3B]" />
              10 Applications via Docker
            </h4>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Operating Systems:</span>
                <strong className="text-[#1B1F3B]">1 shared Host Kernel</strong>
              </div>
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Memory Overhead:</span>
                <strong className="text-[#1B1F3B]">~1.5 GB RAM (96% less!)</strong>
              </div>
              <div className="flex justify-between border-b border-[#1B1F3B]/20 pb-2">
                <span className="text-[#1B1F3B]/70">Cold Boot Time:</span>
                <strong className="text-[#1B1F3B]">0.3 – 1.0 seconds</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1B1F3B]/70">Disk Footprint:</span>
                <strong className="text-[#1B1F3B]">~2.5 GB (shared base layers)</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
