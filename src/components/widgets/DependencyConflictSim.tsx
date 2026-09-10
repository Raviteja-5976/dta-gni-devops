"use client";

import React, { useState } from "react";
import { AlertOctagon, CheckCircle2, XCircle, ArrowLeftRight } from "lucide-react";

export function DependencyConflictSim() {
  const [globalVersion, setGlobalVersion] = useState<"v1" | "v2" | "none">("none");

  const setVersion = (v: "v1" | "v2") => {
    setGlobalVersion(v);
  };

  const loomStatus = globalVersion === "v2" ? "ok" : globalVersion === "v1" ? "broken" : "waiting";
  const candlesStatus = globalVersion === "v1" ? "ok" : globalVersion === "v2" ? "broken" : "waiting";

  return (
    <div className="w-full card-brut bg-white p-4 md:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <span className="chip-mono bg-[#FF5C7A] text-white text-[10px]">Dependency Crisis</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            The Shared Global Package Dilemma
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#1B1F3B]/70">Install:</span>
          <button
            onClick={() => setVersion("v1")}
            className={`tactile-btn px-2.5 py-1 text-xs ${
              globalVersion === "v1" ? "tactile-btn-primary" : "tactile-btn-secondary"
            }`}
          >
            Package X v1.0
          </button>
          <button
            onClick={() => setVersion("v2")}
            className={`tactile-btn px-2.5 py-1 text-xs ${
              globalVersion === "v2" ? "tactile-btn-primary" : "tactile-btn-secondary"
            }`}
          >
            Package X v2.0
          </button>
        </div>
      </div>

      {/* Split Interactive View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Lehar Loom */}
        <div
          className={`p-5 rounded-2xl border-4 ${
            loomStatus === "ok"
              ? "border-[#6EE7B7] bg-[#6EE7B7]/10"
              : loomStatus === "broken"
              ? "border-[#FF5C7A] bg-[#FF5C7A]/15 animate-shake"
              : "border-[#1B1F3B] bg-[#FFF8F0]"
          } shadow-[6px_6px_0_#1B1F3B] transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="chip-mono bg-[#FF6B35] text-white">App A</span>
            {loomStatus === "ok" && <CheckCircle2 className="w-5 h-5 text-[#1B1F3B]" />}
            {loomStatus === "broken" && <XCircle className="w-5 h-5 text-[#FF5C7A]" />}
          </div>
          <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Lehar Loom</h4>
          <p className="font-mono text-xs text-[#1B1F3B]/70 mt-1">Needs: Node 20 + Package X v2</p>

          <div className="mt-4 pt-3 border-t-2 border-[#1B1F3B]/20 font-mono text-xs font-bold">
            {loomStatus === "ok" && <span className="text-[#1B1F3B]">🟢 Running smooth with v2</span>}
            {loomStatus === "broken" && (
              <span className="text-[#FF5C7A]">🔴 CRASH: Missing v2 methods!</span>
            )}
            {loomStatus === "waiting" && <span className="text-[#1B1F3B]/50">Waiting for global install...</span>}
          </div>
        </div>

        {/* Center: The Tug of War */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#F5EBE0] border-4 border-[#1B1F3B] rounded-2xl shadow-[4px_4px_0_#1B1F3B] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FFC93C] border-2 border-[#1B1F3B] flex items-center justify-center shadow-[2px_2px_0_#1B1F3B]">
            <ArrowLeftRight className="w-6 h-6 text-[#1B1F3B]" />
          </div>
          <div className="font-display font-extrabold text-lg text-[#1B1F3B]">
            /usr/local/lib/
          </div>
          <div className="font-mono text-xs font-bold bg-white px-3 py-1.5 border-2 border-[#1B1F3B] rounded-xl shadow-[2px_2px_0_#1B1F3B]">
            Package X: {globalVersion === "none" ? "Not set" : globalVersion}
          </div>
          <p className="font-sans text-[11px] text-[#1B1F3B]/70 leading-tight">
            One server filesystem cannot satisfy both versions simultaneously.
          </p>
        </div>

        {/* Lehar Candles */}
        <div
          className={`p-5 rounded-2xl border-4 ${
            candlesStatus === "ok"
              ? "border-[#6EE7B7] bg-[#6EE7B7]/10"
              : candlesStatus === "broken"
              ? "border-[#FF5C7A] bg-[#FF5C7A]/15 animate-shake"
              : "border-[#1B1F3B] bg-[#FFF8F0]"
          } shadow-[6px_6px_0_#1B1F3B] transition-all`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="chip-mono bg-[#4EA8FF] text-[#1B1F3B]">App B</span>
            {candlesStatus === "ok" && <CheckCircle2 className="w-5 h-5 text-[#1B1F3B]" />}
            {candlesStatus === "broken" && <XCircle className="w-5 h-5 text-[#FF5C7A]" />}
          </div>
          <h4 className="font-display font-extrabold text-xl text-[#1B1F3B]">Lehar Candles</h4>
          <p className="font-mono text-xs text-[#1B1F3B]/70 mt-1">Needs: Node 18 + Package X v1</p>

          <div className="mt-4 pt-3 border-t-2 border-[#1B1F3B]/20 font-mono text-xs font-bold">
            {candlesStatus === "ok" && <span className="text-[#1B1F3B]">🟢 Running smooth with v1</span>}
            {candlesStatus === "broken" && (
              <span className="text-[#FF5C7A]">🔴 CRASH: Incompatible API in v2!</span>
            )}
            {candlesStatus === "waiting" && <span className="text-[#1B1F3B]/50">Waiting for global install...</span>}
          </div>
        </div>
      </div>

      {globalVersion !== "none" && (
        <div className="p-3 bg-[#FF5C7A]/10 border-2 border-[#FF5C7A] rounded-xl flex items-center gap-2 font-mono text-xs text-[#1B1F3B]">
          <AlertOctagon className="w-4 h-4 text-[#FF5C7A] shrink-0" />
          <span>
            {globalVersion === "v1"
              ? "Choosing v1 fixes Candles, but immediately breaks Loom's modern checkout!"
              : "Upgrading to v2 fixes Loom, but crashes Candles' legacy inventory API!"}
          </span>
        </div>
      )}
    </div>
  );
}
