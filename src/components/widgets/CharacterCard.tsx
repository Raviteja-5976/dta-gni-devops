"use client";

import React from "react";
import Image from "next/image";

interface CharacterCardProps {
  name: string;
  role: string;
  badge: string;
  imageSrc: string;
  quote?: string;
  attributes: { label: string; value: string }[];
  accentColor?: string;
}

export function CharacterCard({
  name,
  role,
  badge,
  imageSrc,
  quote,
  attributes,
  accentColor = "bg-[#FF6B35]",
}: CharacterCardProps) {
  return (
    <div className="w-full card-brut bg-white p-4 md:p-6 space-y-4 max-h-[55vh] flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Visual Image Side */}
        <div className="md:col-span-6 relative">
          <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl overflow-hidden border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B]">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="absolute -bottom-2 -right-1">
            <span className={`chip-mono ${accentColor} text-white shadow-[2px_2px_0_#1B1F3B]`}>
              {badge}
            </span>
          </div>
        </div>

        {/* Character Bio & Specs */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#1B1F3B]/60 uppercase tracking-widest">
              Profile Brief
            </span>
            <h3 className="font-display font-extrabold text-3xl md:text-4xl text-[#1B1F3B]">
              {name}
            </h3>
            <p className="font-display font-bold text-base text-[#FF6B35] mt-0.5">
              {role}
            </p>
          </div>

          {quote && (
            <div className="p-4 bg-[#F5EBE0] border-l-4 border-[#FF6B35] rounded-r-xl font-display font-bold text-sm text-[#1B1F3B] italic">
              &ldquo;{quote}&rdquo;
            </div>
          )}

          {/* Attribute Specs */}
          <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
            {attributes.map((attr, idx) => (
              <div key={idx} className="p-2.5 bg-[#FFF8F0] border-2 border-[#1B1F3B] rounded-xl">
                <span className="text-[#1B1F3B]/60 text-[10px] block uppercase font-semibold">
                  {attr.label}
                </span>
                <strong className="text-[#1B1F3B] text-xs mt-0.5 block truncate">
                  {attr.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
