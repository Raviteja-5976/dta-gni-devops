import "server-only";

import { cookies } from "next/headers";
import crypto from "node:crypto";

/* ===========================================================
   ADMIN AUTH — single shared password, no user management.

   The password lives in ADMIN_PASSWORD. On a correct submission we
   set an httpOnly cookie holding "<expiry>.<hmac>", where the HMAC is
   keyed by the password itself. That means:
     - the cookie cannot be forged without knowing the password,
     - changing ADMIN_PASSWORD invalidates every existing session,
     - nothing about the password is recoverable from the cookie.

   The password is never sent to the client and never stored anywhere
   but the environment.
   =========================================================== */

const COOKIE = "workshop_admin";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours — long enough for a teaching day

function password(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  return p && p.length > 0 ? p : null;
}

/** False when ADMIN_PASSWORD is unset — the admin page then refuses to run. */
export function isAdminConfigured(): boolean {
  return password() !== null;
}

function sign(expiry: number, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`workshop-admin-v1:${expiry}`)
    .digest("hex");
}

/** Constant-time compare so a wrong password leaks no timing signal. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyPassword(attempt: string): boolean {
  const secret = password();
  if (!secret) return false;
  return safeEqual(attempt, secret);
}

export async function createAdminSession(): Promise<void> {
  const secret = password();
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");

  const expiry = Date.now() + TTL_MS;
  const store = await cookies();

  store.set(COOKIE, `${expiry}.${sign(expiry, secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(TTL_MS / 1000),
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const secret = password();
  if (!secret) return false;

  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;

  const [expiryRaw, mac] = raw.split(".");
  const expiry = Number(expiryRaw);
  if (!expiryRaw || !mac || !Number.isFinite(expiry)) return false;
  if (Date.now() > expiry) return false;

  return safeEqual(mac, sign(expiry, secret));
}
