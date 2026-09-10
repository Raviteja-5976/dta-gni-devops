"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play } from "lucide-react";

interface TerminalSimulatorProps {
  initialCommand?: string;
  outputLines?: { text: string; type?: "default" | "error" | "success" | "warn" | "dim" | "highlight" }[];
  canRun?: boolean;
  runButtonLabel?: string;
  onRun?: () => void;
  title?: string;
}

export function TerminalSimulator({
  initialCommand = "docker run -d -p 80:80 --name web nginx",
  outputLines = [],
  canRun = true,
  runButtonLabel = "Execute Command",
  onRun,
  title = "bash — terminal@devtrack",
}: TerminalSimulatorProps) {
  const [copied, setCopied] = useState(false);
  const [hasRun, setHasRun] = useState(outputLines.length > 0);
  const [running, setRunning] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(initialCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExecute = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setHasRun(true);
      if (onRun) onRun();
    }, 400);
  };

  return (
    <div className="w-full card-brut bg-[#1B1F3B] text-[#FFF8F0] border-4 border-[#1B1F3B] shadow-[6px_6px_0_#1B1F3B] overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#24294A] border-b-2 border-[#1B1F3B]">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5C7A] border border-[#1B1F3B]/40" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFC93C] border border-[#1B1F3B]/40" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#6EE7B7] border border-[#1B1F3B]/40" />
          <span className="ml-2 font-mono text-xs font-semibold text-[#FFF8F0]/70 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#4EA8FF]" />
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canRun && !hasRun && (
            <button
              onClick={handleExecute}
              disabled={running}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B35] text-white text-xs font-mono font-bold rounded-lg border-2 border-[#FFF8F0]/40 hover:bg-[#ff7b49] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              {running ? "Running..." : runButtonLabel}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[#1B1F3B] text-[#FFF8F0]/70 hover:text-white transition-colors cursor-pointer"
            title="Copy command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#6EE7B7]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 font-mono text-xs sm:text-sm leading-snug overflow-x-auto max-h-[220px] space-y-1.5">
        <div className="flex items-center gap-2 text-[#4EA8FF] font-semibold">
          <span className="text-[#6EE7B7]">sam@lehar-office</span>
          <span className="text-[#FFC93C]">:~/projects$</span>
          <span className="text-white font-bold">{initialCommand}</span>
          <span className="inline-block w-1.5 h-3.5 bg-[#FF6B35] animate-pulse ml-0.5" />
        </div>

        {hasRun && outputLines.length > 0 && (
          <div className="pt-2 border-t border-[#FFF8F0]/10 space-y-1 animate-fadeIn">
            {outputLines.map((line, idx) => {
              let colorClass = "text-[#FFF8F0]/90";
              if (line.type === "error") colorClass = "text-[#FF5C7A] font-bold bg-[#FF5C7A]/10 px-1 py-0.5 rounded";
              if (line.type === "success") colorClass = "text-[#6EE7B7] font-semibold";
              if (line.type === "warn") colorClass = "text-[#FFC93C] font-semibold";
              if (line.type === "dim") colorClass = "text-[#FFF8F0]/50";
              if (line.type === "highlight") colorClass = "text-[#4EA8FF] font-bold";

              return (
                <div key={idx} className={`${colorClass} font-mono text-xs md:text-sm break-words`}>
                  {line.text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
