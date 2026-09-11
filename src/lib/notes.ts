import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describeError, supabase } from "@/lib/store";

/* ===========================================================
   NOTES BOARD STORAGE

   Links and info the instructor publishes for students. Same
   adapter order as the unlock store: Supabase when configured,
   otherwise a local JSON file, otherwise process memory.
   =========================================================== */

const TABLE = "workshop_notes";
const FILE = path.join(process.cwd(), ".workshop-notes.json");

export interface Note {
  id: string;
  title: string;
  url: string | null;
  body: string | null;
  created_at: string;
}

export interface NoteInput {
  title: string;
  url: string | null;
  body: string | null;
}

/* --- File / memory fallback -------------------------------- */

let fileWritable = true;
let memoryNotes: Note[] = [];

async function readFile(): Promise<Note[]> {
  if (!fileWritable) return memoryNotes;
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
    return Array.isArray(parsed?.notes) ? parsed.notes : [];
  } catch {
    return [];
  }
}

async function writeFile(notes: Note[]): Promise<void> {
  memoryNotes = notes;
  if (!fileWritable) return;
  try {
    await fs.writeFile(FILE, JSON.stringify({ notes }, null, 2), "utf8");
  } catch {
    fileWritable = false;
  }
}

const newestFirst = (a: Note, b: Note) =>
  b.created_at.localeCompare(a.created_at);

/* --- Public API -------------------------------------------- */

/**
 * @param strict When true, Supabase failures throw (admin page). Public
 *   pages call it non-strict and show an empty board instead of erroring.
 */
export async function getNotes(strict = false): Promise<Note[]> {
  const sb = supabase();
  if (!sb) return (await readFile()).sort(newestFirst);

  const { data, error } = await sb
    .from(TABLE)
    .select("id, title, url, body, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    const message = describeError(error, TABLE);
    if (strict) throw new Error(`Supabase read failed: ${message}`);
    console.error(`[notes] Supabase read failed: ${message}`);
    return [];
  }
  return (data ?? []) as Note[];
}

export async function addNote(input: NoteInput): Promise<void> {
  const sb = supabase();
  if (sb) {
    const { error } = await sb.from(TABLE).insert(input);
    if (error) throw new Error(`Supabase write failed: ${describeError(error, TABLE)}`);
    return;
  }

  const notes = await readFile();
  notes.push({ id: randomUUID(), created_at: new Date().toISOString(), ...input });
  await writeFile(notes);
}

export async function deleteNote(id: string): Promise<void> {
  const sb = supabase();
  if (sb) {
    const { error } = await sb.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(`Supabase delete failed: ${describeError(error, TABLE)}`);
    return;
  }

  await writeFile((await readFile()).filter((n) => n.id !== id));
}
