/* ===========================================================
   SLIDE BLOCKS

   Session 1 hardcodes one bespoke visual per slide. That does not
   scale to a 103-slide deck, and it doesn't need to: the source
   material is highly regular — vertical arrow-chains, terminal
   sessions, annotated code, side-by-side comparisons — so slides are
   composed from a small set of typed primitives instead.

   A slide usually holds ONE block ("one concept per slide"). The
   array exists for the handful that genuinely pair two, such as
   "here are Sam's versions / here are the other machine's".
   =========================================================== */

/** Palette accents available to blocks, mapped in the renderer. */
export type Tone = "ink" | "orange" | "sky" | "yellow" | "mint" | "coral";

/** Drives the light keyword highlighting in code surfaces. */
export type CodeLanguage =
  | "dockerfile"
  | "yaml"
  | "python"
  | "sql"
  | "bash"
  | "text";

export interface Panel {
  title: string;
  /** Plain lines, or a fenced block when `mono` is set. */
  lines: string[];
  tone?: Tone;
  mono?: boolean;
  note?: string;
}

export interface TerminalLine {
  /** A typed command, shown after a $ prompt. */
  cmd?: string;
  /** Program output, shown dimmed. */
  out?: string;
  /** A commentary line, shown in muted italics. */
  comment?: string;
}

export type SlideBlock =
  /** A single large claim. The workhorse for "one idea" slides. */
  | { kind: "statement"; text: string; sub?: string; tone?: Tone }
  /** Bulleted list; two columns when there are many short items. */
  | { kind: "bullets"; items: string[]; columns?: 1 | 2; tone?: Tone }
  /** Arrow chain. Vertical for short chains, horizontal wrap for long. */
  | {
      kind: "flow";
      steps: string[];
      orientation?: "vertical" | "horizontal";
      tone?: Tone;
      highlightLast?: boolean;
    }
  /** Two panels compared side by side. */
  | { kind: "split"; left: Panel; right: Panel }
  /** Terminal session on ink, with $ prompts and dimmed output. */
  | { kind: "terminal"; lines: TerminalLine[]; title?: string }
  /** A source file with a filename tab. */
  | {
      kind: "code";
      filename: string;
      code: string;
      language?: CodeLanguage;
    }
  /** Code on the left, per-instruction notes on the right. */
  | {
      kind: "annotated";
      code: string;
      filename?: string;
      language?: CodeLanguage;
      notes: { label: string; text: string }[];
    }
  /** Grouped command reference. */
  | { kind: "cheatsheet"; groups: { title: string; commands: string[] }[] }
  /** Stacked layers, e.g. the VM vs container diagram. */
  | { kind: "stack"; layers: { label: string; tone?: Tone }[]; caption?: string }
  /** Free-standing labelled boxes, optionally joined by an arrow. */
  | {
      kind: "boxes";
      boxes: { title: string; lines?: string[]; tone?: Tone }[];
      connector?: string;
    }
  /** A true row-by-row comparison. Use split for two loose lists. */
  | {
      kind: "table";
      columns: string[];
      rows: string[][];
      /** Header tone per column; the first column is the row label. */
      columnTones?: Tone[];
    }
  /** An ordered diagnostic list. Numbered because it IS a sequence. */
  | { kind: "checklist"; items: string[]; title?: string }
  /** A short aside — the reference's recurring sarcastic remarks. */
  | { kind: "callout"; text: string; tone?: Tone; label?: string }
  /** A small fake app window, for the Streamlit mockups. */
  | {
      kind: "mockup";
      title: string;
      fields: string[];
      /** Label of the form's action button, e.g. "Submit" or "Publish". */
      button?: string;
      result?: string;
    };
