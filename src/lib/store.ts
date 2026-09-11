import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ===========================================================
   UNLOCK-STATE STORAGE

   Holds the list of session slugs an admin has activated. This is
   global state shared by every visitor, so it cannot live in a cookie
   or localStorage — and on serverless hosts it cannot live on disk
   either (read-only filesystem, many short-lived instances).

   Adapters, chosen at runtime:
     1. Supabase — for Vercel and any other serverless host.
     2. A JSON file — for local dev and self-hosted Node, so the app
        runs with zero configuration on your machine.
     3. Process memory — last resort, so the app still boots on a
        read-only filesystem with nothing configured. State is lost on
        restart and is NOT shared across instances; the admin page
        warns loudly when this is what's in play.

   This module is server-only (see the import above), so the service
   role key can never be pulled into a client bundle.
   =========================================================== */

/** Table holding one row per setting. See supabase/schema.sql. */
const TABLE = "workshop_settings";
const KEY = "unlocked-sessions";

export type StorageMode = "supabase" | "file" | "memory";

/* --- Adapter 1: Supabase ----------------------------------- */

let cachedClient: SupabaseClient | null = null;

/** Values copied straight out of .env.example, never filled in. */
const PLACEHOLDERS = [
  "your-project-ref",
  "your-service-role-key",
  "change-me",
];

function looksUnfilled(value: string): boolean {
  const v = value.toLowerCase();
  return PLACEHOLDERS.some((p) => v.includes(p));
}

/**
 * Why the Supabase adapter is inactive, or null when it's fine. Surfaced on
 * the admin page so a misconfiguration is visible rather than mysterious.
 */
export function supabaseConfigProblem(): string | null {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url && !key) return null; // simply not configured — that's allowed
  if (!url) return "SUPABASE_URL is missing.";
  if (!key) return "SUPABASE_SERVICE_ROLE_KEY is missing.";

  if (looksUnfilled(url) || looksUnfilled(key)) {
    return "Supabase credentials are still the .env.example placeholders — replace them with your real project values.";
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return `SUPABASE_URL is not a valid URL: ${url}`;
  }
  // Hosted Supabase is always https, but a local stack (`supabase start`)
  // serves plain http on localhost — allow that.
  const isLocal =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !isLocal) {
    return `SUPABASE_URL should start with https:// (got ${parsed.protocol}//).`;
  }
  // A service role key is a JWT; anything this short is the wrong value.
  if (key.length < 40) {
    return "SUPABASE_SERVICE_ROLE_KEY looks too short to be a real key (expected a long JWT).";
  }
  return null;
}

export function supabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;

  // Half-configured credentials would otherwise fail at request time with an
  // opaque "fetch failed". Treat them as not configured so local development
  // keeps working on the file adapter, and let the admin page explain why.
  if (supabaseConfigProblem()) return null;

  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

/** Which adapter is live — surfaced on the admin page. */
export function storageMode(): StorageMode {
  if (supabase()) return "supabase";
  return fileWritable ? "file" : "memory";
}

/** Turn PostgREST's terser failures into something actionable. */
export function describeError(
  error: { message: string; code?: string },
  table: string = TABLE
): string {
  if (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.message.includes("does not exist") ||
    error.message.includes("Could not find the table")
  ) {
    return `Table "${table}" is missing. Run supabase/schema.sql in your project's SQL editor.`;
  }
  // Node's fetch collapses DNS/TLS/connection errors into "fetch failed",
  // which says nothing useful on its own.
  if (error.message.toLowerCase().includes("fetch failed")) {
    return (
      "Could not reach Supabase. Check that SUPABASE_URL points at your real " +
      "project (Project Settings → API → Project URL) and that this machine has network access."
    );
  }
  if (error.message.includes("Invalid API key") || error.code === "PGRST301") {
    return "Supabase rejected the key. Check SUPABASE_SERVICE_ROLE_KEY (Project Settings → API → service_role).";
  }
  return error.message;
}

/* --- Adapter 2: JSON file ---------------------------------- */

import { promises as fs } from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), ".workshop-state.json");
let fileWritable = true;
let memoryState: string[] = [];

async function readFile(): Promise<string[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.unlocked) ? parsed.unlocked : [];
  } catch {
    // Missing or unreadable file simply means "nothing unlocked yet".
    return [];
  }
}

async function writeFile(slugs: string[]): Promise<void> {
  try {
    await fs.writeFile(
      FILE,
      JSON.stringify({ unlocked: slugs }, null, 2),
      "utf8"
    );
  } catch {
    // Read-only filesystem with no Supabase configured.
    fileWritable = false;
    memoryState = slugs;
  }
}

/* --- Public API -------------------------------------------- */

/**
 * @param strict When true, storage failures throw. The admin page needs
 *   the truth — it must never show "locked" because a query failed and
 *   have the instructor toggle against a phantom state. Public pages
 *   call this non-strict: if Supabase is unreachable mid-class they
 *   fail CLOSED (everything locked) and stay up, rather than serving an
 *   error page to a room full of students or, worse, leaking a session
 *   that hasn't been activated yet.
 */
export async function getUnlockedSessions(strict = false): Promise<string[]> {
  const sb = supabase();

  if (sb) {
    try {
      const { data, error } = await sb
        .from(TABLE)
        .select("value")
        .eq("key", KEY)
        .maybeSingle();

      if (error) throw new Error(describeError(error));

      // No row yet is the normal starting state: nothing unlocked.
      const value = data?.value;
      return Array.isArray(value) ? (value as string[]) : [];
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      if (strict) throw new Error(`Supabase read failed: ${message}`);
      console.error(`[store] Supabase read failed, failing closed: ${message}`);
      return [];
    }
  }

  if (!fileWritable) return memoryState;
  return readFile();
}

export async function setSessionUnlocked(
  slug: string,
  unlocked: boolean
): Promise<string[]> {
  const current = await getUnlockedSessions();
  const next = unlocked
    ? Array.from(new Set([...current, slug]))
    : current.filter((s) => s !== slug);

  const sb = supabase();

  if (sb) {
    const { error } = await sb
      .from(TABLE)
      .upsert(
        { key: KEY, value: next, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (error) throw new Error(`Supabase write failed: ${describeError(error)}`);
  } else {
    await writeFile(next);
    if (!fileWritable) memoryState = next;
  }

  return next;
}
