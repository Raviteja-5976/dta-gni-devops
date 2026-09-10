import React from "react";
import { ArrowRight, ArrowDown, ChevronRight } from "lucide-react";
import type { SlideBlock, Tone, Panel, CodeLanguage } from "./types";

/* ===========================================================
   BLOCK RENDERER

   Draws the typed primitives in types.ts using the deck's existing
   neo-brutalist vocabulary: square corners, heavy rules, hard offset
   shadows, the Session 1 palette.

   Command and code surfaces sit on ink — that's where this session's
   "developer" character lives, rather than in a separate theme.

   Everything is authored at the ~1300px content width the rest of the
   deck assumes; useFitScale scales each slide to its stage box.
   =========================================================== */

const TONE: Record<Tone, { bg: string; fg: string }> = {
  ink: { bg: "#1B1F3B", fg: "#FFF8F0" },
  orange: { bg: "#FF6B35", fg: "#FFFFFF" },
  sky: { bg: "#4EA8FF", fg: "#1B1F3B" },
  yellow: { bg: "#FFC93C", fg: "#1B1F3B" },
  mint: { bg: "#6EE7B7", fg: "#1B1F3B" },
  coral: { bg: "#FF5C7A", fg: "#FFFFFF" },
};

/* --- Shared bits ------------------------------------------- */

function PanelCard({ panel }: { panel: Panel }) {
  const tone = TONE[panel.tone ?? "ink"];
  const dark = (panel.tone ?? "ink") === "ink";

  return (
    <div className="flex-1 min-w-0 border-4 border-[#1B1F3B] bg-white shadow-[6px_6px_0_#1B1F3B] flex flex-col">
      <div
        className="px-4 py-2.5 border-b-4 border-[#1B1F3B] font-display text-base"
        style={{ background: tone.bg, color: tone.fg }}
      >
        {panel.title}
      </div>
      <div className="p-4 flex-1">
        <ul className="space-y-1.5">
          {panel.lines.map((line, i) => (
            <li
              key={i}
              className={
                panel.mono
                  ? "font-mono text-[13px] text-[#1B1F3B] whitespace-pre-wrap break-words"
                  : "font-sans text-sm text-[#1B1F3B]/85 flex gap-2"
              }
            >
              {panel.mono ? (
                line
              ) : (
                <>
                  <span
                    className="mt-1.5 w-2 h-2 shrink-0"
                    style={{ background: dark ? "#FF6B35" : tone.bg }}
                  />
                  <span>{line}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        {panel.note && (
          <p className="mt-3 pt-2 border-t-2 border-[#1B1F3B]/15 font-mono text-[11px] text-[#1B1F3B]/60">
            {panel.note}
          </p>
        )}
      </div>
    </div>
  );
}

/* Deliberately shallow highlighting — enough that a Dockerfile, a compose
   file and a Python snippet read as visibly different kinds of thing,
   without pulling in a syntax-highlighting dependency. */
const DOCKERFILE_KW =
  /^(FROM|RUN|WORKDIR|COPY|CMD|ENV|EXPOSE|ENTRYPOINT|ADD|ARG|VOLUME|LABEL|USER|HEALTHCHECK)\b/;
const PYTHON_KW =
  /\b(import|from|def|return|if|else|elif|for|while|with|as|not|in|True|False|None)\b/g;
const SQL_KW =
  /\b(CREATE|TABLE|INSERT|INTO|VALUES|SELECT|UPDATE|SET|DELETE|FROM|WHERE|PRIMARY|KEY|AUTO_INCREMENT|NOT|NULL|DEFAULT|INT|VARCHAR|BOOLEAN|TRUE|FALSE)\b/g;

function highlightWords(line: string, re: RegExp, className: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(line.slice(last, start));
    parts.push(
      <span key={start} className={className}>
        {m[0]}
      </span>
    );
    last = start + m[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

function CodeLine({
  line,
  language = "dockerfile",
}: {
  line: string;
  language?: CodeLanguage;
}) {
  // Comments win over any keyword that appears inside them.
  if (language !== "yaml" && line.trimStart().startsWith("#")) {
    return <div className="whitespace-pre-wrap break-words text-[#FFF8F0]/40">{line}</div>;
  }

  if (language === "yaml") {
    const key = line.match(/^(\s*)([\w.-]+)(:)/);
    if (key) {
      return (
        <div className="whitespace-pre-wrap break-words">
          {key[1]}
          <span className="text-[#4EA8FF] font-bold">{key[2]}</span>
          <span className="text-[#FFF8F0]/60">{key[3]}</span>
          <span className="text-[#FFF8F0]">{line.slice(key[0].length)}</span>
        </div>
      );
    }
    const item = line.match(/^(\s*)(-\s)/);
    if (item) {
      return (
        <div className="whitespace-pre-wrap break-words">
          {item[1]}
          <span className="text-[#FF6B35] font-bold">{item[2]}</span>
          <span className="text-[#FFF8F0]">{line.slice(item[0].length)}</span>
        </div>
      );
    }
    return <div className="whitespace-pre-wrap break-words text-[#FFF8F0]">{line || " "}</div>;
  }

  if (language === "python") {
    return (
      <div className="whitespace-pre-wrap break-words text-[#FFF8F0]">
        {highlightWords(line, PYTHON_KW, "text-[#4EA8FF] font-bold")}
      </div>
    );
  }

  if (language === "sql") {
    return (
      <div className="whitespace-pre-wrap break-words text-[#FFF8F0]">
        {highlightWords(line, SQL_KW, "text-[#FFC93C] font-bold")}
      </div>
    );
  }

  const kw = line.match(DOCKERFILE_KW);
  if (kw) {
    return (
      <div className="whitespace-pre-wrap break-words">
        <span className="text-[#FFC93C] font-bold">{kw[0]}</span>
        <span className="text-[#FFF8F0]">{line.slice(kw[0].length)}</span>
      </div>
    );
  }
  return <div className="whitespace-pre-wrap break-words text-[#FFF8F0]">{line || " "}</div>;
}

/* --- The renderer ------------------------------------------ */

export function Block({ block }: { block: SlideBlock }) {
  switch (block.kind) {
    /* ---------- Statement ---------- */
    case "statement": {
      const tone = TONE[block.tone ?? "orange"];
      return (
        <div className="w-full text-center py-2">
          <h2 className="font-display text-[46px] leading-[1.1] text-[#1B1F3B] tracking-tight">
            {block.text}
          </h2>
          {block.sub && (
            <p className="font-sans text-lg text-[#1B1F3B]/65 mt-4 max-w-3xl mx-auto leading-relaxed">
              {block.sub}
            </p>
          )}
          <div
            className="mx-auto mt-6 h-2 w-40 border-2 border-[#1B1F3B]"
            style={{ background: tone.bg }}
          />
        </div>
      );
    }

    /* ---------- Bullets ---------- */
    case "bullets": {
      const tone = TONE[block.tone ?? "orange"];
      const cols = block.columns ?? (block.items.length > 5 ? 2 : 1);
      return (
        <ul
          className={`w-full max-w-4xl mx-auto grid gap-3 ${
            cols === 2 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 border-4 border-[#1B1F3B] bg-white shadow-[4px_4px_0_#1B1F3B] px-4 py-3"
            >
              <span
                className="w-4 h-4 shrink-0 border-2 border-[#1B1F3B]"
                style={{ background: tone.bg }}
              />
              <span className="font-display text-lg text-[#1B1F3B]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    /* ---------- Flow (arrow chain) ---------- */
    case "flow": {
      const tone = TONE[block.tone ?? "orange"];
      // Long chains would overflow a vertical column, so they run
      // horizontally and wrap instead.
      const orientation =
        block.orientation ?? (block.steps.length > 5 ? "horizontal" : "vertical");
      const horizontal = orientation === "horizontal";
      const Arrow = horizontal ? ArrowRight : ArrowDown;

      return (
        <div
          className={`w-full flex items-center justify-center ${
            horizontal ? "flex-row flex-wrap gap-y-3" : "flex-col"
          }`}
        >
          {block.steps.map((step, i) => {
            const last = i === block.steps.length - 1;
            const emphasise = last && block.highlightLast;
            return (
              <React.Fragment key={i}>
                <div
                  className="border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B] px-5 py-3 font-display text-center"
                  style={{
                    background: emphasise ? tone.bg : "#FFFFFF",
                    color: emphasise ? tone.fg : "#1B1F3B",
                    fontSize: horizontal ? "15px" : "19px",
                    minWidth: horizontal ? undefined : "260px",
                  }}
                >
                  {step}
                </div>
                {!last && (
                  <Arrow
                    className={horizontal ? "w-6 h-6 mx-2" : "w-7 h-7 my-1.5"}
                    style={{ color: tone.bg }}
                    strokeWidth={3}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    }

    /* ---------- Split comparison ---------- */
    case "split":
      return (
        <div className="w-full flex items-stretch gap-6">
          <PanelCard panel={block.left} />
          <PanelCard panel={block.right} />
        </div>
      );

    /* ---------- Terminal ---------- */
    case "terminal":
      return (
        <div className="w-full max-w-4xl mx-auto border-4 border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] bg-[#1B1F3B]">
          <div className="flex items-center gap-3 px-4 py-2 border-b-4 border-[#FFF8F0]/20">
            <span className="w-3 h-3 bg-[#FF5C7A] border-2 border-[#FFF8F0]/30" />
            <span className="w-3 h-3 bg-[#FFC93C] border-2 border-[#FFF8F0]/30" />
            <span className="w-3 h-3 bg-[#6EE7B7] border-2 border-[#FFF8F0]/30" />
            <span className="ml-2 font-mono text-[12px] text-[#FFF8F0]/55 uppercase tracking-wider">
              {block.title ?? "terminal"}
            </span>
          </div>
          <div className="p-5 font-mono text-[15px] leading-relaxed space-y-1">
            {block.lines.map((line, i) => {
              if (line.cmd) {
                return (
                  <div key={i} className="flex gap-2.5">
                    <span className="text-[#FF6B35] font-bold shrink-0">$</span>
                    <span className="text-[#FFF8F0] whitespace-pre-wrap">
                      {line.cmd}
                    </span>
                  </div>
                );
              }
              if (line.comment) {
                return (
                  <div key={i} className="text-[#FFF8F0]/40 italic pl-5">
                    {line.comment}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="text-[#6EE7B7] whitespace-pre-wrap pl-5"
                >
                  {line.out}
                </div>
              );
            })}
          </div>
        </div>
      );

    /* ---------- Code file ---------- */
    case "code":
      return (
        <div className="w-full max-w-3xl mx-auto">
          <div className="inline-block bg-[#FFC93C] text-[#1B1F3B] border-4 border-[#1B1F3B] border-b-0 px-4 py-1.5 font-mono text-[13px] font-bold">
            {block.filename}
          </div>
          <div className="border-4 border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] bg-[#1B1F3B] p-5 font-mono text-[15px] leading-relaxed">
            {block.code.split("\n").map((line, i) => (
              <CodeLine key={i} line={line} language={block.language} />
            ))}
          </div>
        </div>
      );

    /* ---------- Annotated code ---------- */
    case "annotated":
      return (
        <div className="w-full flex items-start gap-6">
          <div className="flex-1 min-w-0">
            {block.filename && (
              <div className="inline-block bg-[#FFC93C] text-[#1B1F3B] border-4 border-[#1B1F3B] border-b-0 px-4 py-1.5 font-mono text-[13px] font-bold">
                {block.filename}
              </div>
            )}
            <div className="border-4 border-[#1B1F3B] shadow-[6px_6px_0_#1B1F3B] bg-[#1B1F3B] p-4 font-mono text-[15px] leading-relaxed">
              {block.code.split("\n").map((line, i) => (
                <CodeLine key={i} line={line} language={block.language} />
              ))}
            </div>
          </div>
          <ul className="w-[40%] shrink-0 space-y-3">
            {block.notes.map((note, i) => (
              <li
                key={i}
                className="border-4 border-[#1B1F3B] bg-white shadow-[4px_4px_0_#1B1F3B] p-3"
              >
                <span className="font-mono text-[12px] font-bold bg-[#4EA8FF] text-[#1B1F3B] px-2 py-0.5 border-2 border-[#1B1F3B]">
                  {note.label}
                </span>
                <p className="font-sans text-sm text-[#1B1F3B]/80 mt-2 leading-snug">
                  {note.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      );

    /* ---------- Cheat sheet ---------- */
    case "cheatsheet":
      return (
        <div
          className="w-full grid gap-5"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              block.groups.length,
              2
            )}, minmax(0, 1fr))`,
          }}
        >
          {block.groups.map((group, i) => (
            <div
              key={i}
              className="border-4 border-[#1B1F3B] bg-white shadow-[6px_6px_0_#1B1F3B]"
            >
              <div className="px-4 py-2 bg-[#1B1F3B] text-[#FFF8F0] font-display text-base">
                {group.title}
              </div>
              <ul className="p-4 space-y-2">
                {group.commands.map((cmd, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ChevronRight
                      className="w-4 h-4 mt-0.5 shrink-0 text-[#FF6B35]"
                      strokeWidth={3}
                    />
                    {/* pre-wrap so a backslash-newline continuation renders
                        as a real second line under one chevron. */}
                    <code className="font-mono text-[14px] text-[#1B1F3B] whitespace-pre-wrap">
                      {cmd}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    /* ---------- Layer stack ---------- */
    case "stack":
      return (
        <div className="w-full max-w-md mx-auto">
          <div className="border-4 border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] bg-white">
            {block.layers.map((layer, i) => {
              const tone = TONE[layer.tone ?? "ink"];
              return (
                <div
                  key={i}
                  className="px-4 py-3 font-display text-base text-center border-b-4 border-[#1B1F3B] last:border-b-0"
                  style={{ background: tone.bg, color: tone.fg }}
                >
                  {layer.label}
                </div>
              );
            })}
          </div>
          {block.caption && (
            <p className="text-center font-mono text-[12px] text-[#1B1F3B]/60 mt-3 uppercase tracking-wider">
              {block.caption}
            </p>
          )}
        </div>
      );

    /* ---------- Boxes ---------- */
    case "boxes":
      return (
        <div className="w-full flex items-center justify-center gap-5 flex-wrap">
          {block.boxes.map((box, i) => {
            const tone = TONE[box.tone ?? "ink"];
            return (
              <React.Fragment key={i}>
                <div className="border-4 border-[#1B1F3B] bg-white shadow-[6px_6px_0_#1B1F3B] min-w-[220px]">
                  <div
                    className="px-4 py-2 border-b-4 border-[#1B1F3B] font-display text-base text-center"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    {box.title}
                  </div>
                  {box.lines && box.lines.length > 0 && (
                    <ul className="p-3 space-y-1">
                      {box.lines.map((line, j) => (
                        <li
                          key={j}
                          className="font-mono text-[13px] text-[#1B1F3B]/80 text-center"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {i < block.boxes.length - 1 && block.connector && (
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight
                      className="w-7 h-7 text-[#FF6B35]"
                      strokeWidth={3}
                    />
                    <span className="font-mono text-[11px] font-bold text-[#1B1F3B]/60 uppercase tracking-wider">
                      {block.connector}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      );

    /* ---------- Table ---------- */
    case "table": {
      const tones = block.columnTones ?? [];
      return (
        <div className="w-full max-w-5xl mx-auto border-4 border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {block.columns.map((col, i) => {
                  const tone = TONE[tones[i] ?? "ink"];
                  return (
                    <th
                      key={i}
                      scope="col"
                      className="px-4 py-3 text-left font-display text-base border-b-4 border-[#1B1F3B] [&:not(:first-child)]:border-l-4"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="[&:not(:last-child)]:border-b-2 border-[#1B1F3B]/15">
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th
                        key={c}
                        scope="row"
                        className="px-4 py-2.5 text-left font-display text-[15px] text-[#1B1F3B] bg-[#F5EBE0]"
                      >
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={c}
                        className="px-4 py-2.5 font-sans text-[15px] text-[#1B1F3B]/85 border-l-4 border-[#1B1F3B]"
                      >
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    /* ---------- Checklist ----------
       Numbered because this content genuinely is a sequence — a
       diagnostic order to work through, not a decorated list. */
    case "checklist":
      return (
        <div className="w-full max-w-3xl mx-auto">
          {block.title && (
            <div className="px-4 py-2.5 bg-[#1B1F3B] text-[#FFF8F0] font-display text-base border-4 border-[#1B1F3B]">
              {block.title}
            </div>
          )}
          <ol className="space-y-2.5 mt-3">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 border-4 border-[#1B1F3B] bg-white shadow-[4px_4px_0_#1B1F3B] px-4 py-3"
              >
                <span className="font-mono text-[14px] font-bold bg-[#4EA8FF] text-[#1B1F3B] w-8 h-8 shrink-0 border-2 border-[#1B1F3B] flex items-center justify-center tabular-nums">
                  {i + 1}
                </span>
                <span className="font-sans text-base text-[#1B1F3B]">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    /* ---------- Callout ---------- */
    case "callout": {
      const tone = TONE[block.tone ?? "yellow"];
      return (
        <div
          className="w-full max-w-3xl mx-auto border-4 border-[#1B1F3B] shadow-[6px_6px_0_#1B1F3B] px-6 py-4 flex items-center gap-4"
          style={{ background: tone.bg, color: tone.fg }}
        >
          {block.label && (
            <span className="font-mono text-[12px] font-bold bg-[#1B1F3B] text-[#FFF8F0] px-2.5 py-1 shrink-0 uppercase tracking-wider">
              {block.label}
            </span>
          )}
          <p className="font-display text-lg leading-snug">{block.text}</p>
        </div>
      );
    }

    /* ---------- App mockup ---------- */
    case "mockup":
      return (
        <div className="w-full max-w-lg mx-auto border-4 border-[#1B1F3B] shadow-[10px_10px_0_#1B1F3B] bg-white">
          <div className="px-4 py-2 bg-[#F5EBE0] border-b-4 border-[#1B1F3B] font-mono text-[12px] font-bold text-[#1B1F3B]/70">
            {block.title}
          </div>
          <div className="p-6 space-y-4">
            {block.fields.map((field, i) => (
              <div key={i}>
                <span className="font-sans text-sm text-[#1B1F3B]/60">
                  {field}
                </span>
                <div className="mt-1.5 h-10 border-4 border-[#1B1F3B] bg-[#FFF8F0]" />
              </div>
            ))}
            {block.button && (
              <span className="inline-flex px-4 py-2 bg-[#FF6B35] text-white font-display text-sm border-4 border-[#1B1F3B] shadow-[3px_3px_0_#1B1F3B]">
                {block.button}
              </span>
            )}
            {block.result && (
              <p className="font-display text-xl text-[#1B1F3B] pt-2">
                {block.result}
              </p>
            )}
          </div>
        </div>
      );
  }
}

export function BlockRenderer({ blocks }: { blocks: SlideBlock[] }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
