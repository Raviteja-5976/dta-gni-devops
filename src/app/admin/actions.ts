"use server";

import { revalidatePath } from "next/cache";
import {
  createAdminSession,
  destroyAdminSession,
  isAdmin,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/admin-auth";
import { setSessionUnlocked } from "@/lib/store";
import { addNote, deleteNote } from "@/lib/notes";
import { getSession } from "@/lib/sessions";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "ADMIN_PASSWORD is not set on the server." };
  }

  const attempt = String(formData.get("password") ?? "");
  if (!attempt) return { error: "Enter the instructor password." };

  if (!verifyPassword(attempt)) {
    // Small constant delay blunts trivial brute-forcing of a shared password.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Incorrect password." };
  }

  await createAdminSession();
  revalidatePath("/admin");
  return {};
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  revalidatePath("/admin");
}

export async function toggleSessionAction(formData: FormData): Promise<void> {
  // Every mutation re-checks the cookie: a form post is not proof of auth.
  if (!(await isAdmin())) throw new Error("Not authorised");

  const slug = String(formData.get("slug") ?? "");
  const next = String(formData.get("next") ?? "") === "true";

  if (!getSession(slug)) throw new Error(`Unknown session: ${slug}`);

  await setSessionUnlocked(slug, next);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/sessions/${slug}`);
}

export interface NoteFormState {
  error?: string;
  ok?: boolean;
}

export async function addNoteAction(
  _prev: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  if (!(await isAdmin())) return { error: "Not authorised." };

  const title = String(formData.get("title") ?? "").trim();
  const rawUrl = String(formData.get("url") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title) return { error: "Give the note a title." };
  if (title.length > 200) return { error: "Title is too long (200 max)." };
  if (body.length > 5000) return { error: "Details are too long (5000 max)." };

  let url: string | null = null;
  if (rawUrl) {
    // Only http(s) — a javascript: URL here would run in students' browsers.
    const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(rawUrl)
      ? rawUrl
      : `https://${rawUrl}`;
    try {
      const parsed = new URL(withScheme);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: "Links must start with http:// or https://." };
      }
      url = parsed.toString();
    } catch {
      return { error: "That link doesn't look like a valid URL." };
    }
  }

  try {
    await addNote({ title, url, body: body || null });
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }

  revalidatePath("/admin");
  revalidatePath("/notes");
  return { ok: true };
}

export async function deleteNoteAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not authorised");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing note id");

  await deleteNote(id);

  revalidatePath("/admin");
  revalidatePath("/notes");
}
