"use client";

import React, { useState } from "react";
import { MousePointerClick, FileCode, Check, AlertCircle } from "lucide-react";

export function TerraformClickOpsVsCode() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="w-full card-brut bg-white p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-[#1B1F3B] pb-2">
        <div>
          <span className="chip-mono bg-[#FF5C7A] text-white text-[10px]">Infrastructure Evolution</span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1F3B] mt-0.5">
            ClickOps Nightmare vs. Declarative Code
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[10px]">Terraform Engine</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ClickOps Console */}
        <div className="p-4 bg-[#FF5C7A]/10 border-4 border-[#1B1F3B] rounded-2xl shadow-[6px_6px_0_#1B1F3B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="chip-mono bg-[#FF5C7A] text-white">The Old Way: ClickOps</span>
              <span className="font-mono text-xs font-bold text-[#FF5C7A]">Manual & Fragile</span>
            </div>
            <h4 className="font-display font-extrabold text-lg text-[#1B1F3B]">
              Web Console Memory Test
            </h4>
            <p className="font-sans text-xs text-[#1B1F3B]/70 mt-1">
              Clicking 142 checkboxes, dropdowns, and subnets across 8 different web console tabs.
            </p>

            <div className="mt-3 p-3 bg-white border-2 border-[#1B1F3B] rounded-xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[#1B1F3B]">
                <span>Cloud Console Clicks:</span>
                <strong className="text-[#FF6B35]">{clickCount} / 45 required</strong>
              </div>
              <button
                onClick={() => setClickCount((c) => c + 1)}
                className="w-full tactile-btn tactile-btn-secondary py-2 text-xs"
              >
                <MousePointerClick className="w-4 h-4 text-[#FF5C7A]" />
                Click To Configure Subnet #{clickCount + 1}
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 text-[11px] font-mono text-[#FF5C7A]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>One typo in security group rules = Production downtime & zero audit trail.</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#1B1F3B]/20 font-mono text-[11px] text-[#1B1F3B]/60">
            Cannot be automated. Cannot be reviewed. Cannot be rolled back easily.
          </div>
        </div>

        {/* Infrastructure as Code (Terraform) */}
        <div className="p-4 bg-[#1B1F3B] text-[#FFF8F0] border-4 border-[#1B1F3B] rounded-2xl shadow-[6px_6px_0_#1B1F3B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B]">The Modern Way: IaC</span>
              <span className="font-mono text-xs font-bold text-[#6EE7B7] flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5" />
                infrastructure.tf
              </span>
            </div>
            <h4 className="font-display font-extrabold text-lg text-white">
              Declarative Blueprint
            </h4>
            <p className="font-sans text-xs text-[#FFF8F0]/70 mt-1">
              Define the desired state once in code. Terraform builds the entire fleet in seconds.
            </p>

            <pre className="mt-3 p-3 bg-[#24294A] border-2 border-[#FFF8F0]/20 rounded-xl font-mono text-xs text-[#6EE7B7] overflow-x-auto leading-snug">
{`resource "aws_vpc" "lehar_vpc" {
  cidr_block = "10.0.0.0/16"
}
resource "aws_eks_cluster" "cluster" {
  name     = "lehar-production"
  role_arn = aws_iam_role.eks.arn
  version  = "1.30"
}`}
            </pre>
          </div>

          <div className="mt-3 pt-2 border-t border-[#FFF8F0]/20 flex items-center justify-between font-mono text-xs text-[#6EE7B7]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Version controlled in Git
            </span>
            <span className="chip-mono bg-[#FF6B35] text-white text-[10px]">
              $ terraform apply
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
