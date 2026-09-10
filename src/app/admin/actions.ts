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
