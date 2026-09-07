/**
 * Share-link tokens.
 *
 * Ported from Portfolio-Studio's `randomInviteToken` in `src/lib/slug.ts`,
 * which is the same problem: an unguessable handle that appears in a URL and
 * grants a scoped read without a login.
 *
 * `crypto.getRandomValues` rather than `Math.random`, and 24 bytes rather than
 * 16, because a token that appears in a URL sent by email is the only thing
 * standing between a stranger and someone's health-adjacent record. Node 18+
 * and every browser expose `crypto` globally, so this runs unchanged in a
 * server component, a route handler, and the seed script.
 */

/** Bytes of entropy per token. 24 bytes is 192 bits, rendered as 48 hex chars. */
const TOKEN_BYTES = 24;

export function randomShareToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
