/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  PROJECT-SPECIFIC AUTHENTICATION ADAPTER — Bunkai TMS           ║
 * ║  THIS is the only file to adapt to the project's auth flow.      ║
 * ║  It ships once with the scaffold and is never overwritten by     ║
 * ║  `bun run up` — the CLI around it (scripts/lib/api-login-core.ts)║
 * ║  keeps syncing, so upstream improvements arrive without          ║
 * ║  clobbering this adaptation.                                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Stack: Next.js 15 + Supabase Auth + a custom PAT layer.
 *
 * Flow (per the /qa testability guide + Epic BK-29):
 *   1. POST /api/v1/auth/signin { email, password }
 *      → { user, session, pat: { token: "bk_pat_<prefix>.<secret>" } }
 *   2. The token every headless consumer needs is the PAT, NOT the Supabase
 *      JWT in `session.access_token`: the JWT is short-lived and oriented at
 *      the cookie flow, while the PAT is long-lived, scoped and Bearer-ready.
 *
 * Contract (see `ApiLoginAdapter` in scripts/lib/api-login-core.ts):
 *   buildAuthPayload            (required) request body for the auth endpoint
 *   extractTokenFromResponse    (required) token fields out of the response
 *   loginEndpoint               (optional) overrides config.auth.loginEndpoint
 *   headers                     (optional) extra request headers
 *   environments                (optional) positional environments accepted
 *   extraFlags                  (optional) project flags that take a value
 */

import type { ApiLoginContext, ExtractedToken } from './lib/api-login-core';

/**
 * Environments accepted as the positional argument. MUST match the
 * `Environment` union in config/variables.ts (add 'qa' / 'production' in both
 * places when the project grows them).
 */
export const environments = ['local', 'staging'] as const;

/** PAT lifetime hint used when neither the PAT nor the session reports one. */
const PAT_DEFAULT_TTL_SECONDS = 86400 * 30;

/**
 * Build the signin body for the role the caller asked for.
 *
 * The core resolves `config.testUser` (the env-scoped default user) and hands
 * its email + password in. Bunkai mirrors the product's RBAC roles
 * (viewer / member / admin / owner) as separate `{ENV}_{ROLE}_*` credentials,
 * so a named role uses its own pair when `.env` provides one.
 *
 * KNOWN GAP: when a named role has no credentials in `.env`, this falls back
 * to the default user rather than failing, because the role only names the
 * token variable in the synced CLI contract. The stored token is then the
 * default user's under an `API_TOKEN_<ROLE>_<ENV>` name. Only the `user` role
 * is provisioned on this project today (see AGENTS.md §13.1); provision the
 * role in `.env` before trusting a role-scoped token.
 */
export function buildAuthPayload(
  email: string,
  password: string,
  context: ApiLoginContext,
): Record<string, unknown> {
  if (context.role === 'user') {
    return { email, password };
  }

  const ENV = context.env.toUpperCase();
  const ROLE = context.role.toUpperCase();
  const roleEmail = process.env[`${ENV}_${ROLE}_EMAIL`];
  const rolePassword = process.env[`${ENV}_${ROLE}_PASSWORD`];

  if (roleEmail && rolePassword) {
    return { email: roleEmail, password: rolePassword };
  }

  return { email, password };
}

/**
 * Extract the token fields from the Bunkai auth response.
 *
 * Response shape:
 *   {
 *     user:    { id, email },
 *     session: { access_token, refresh_token, expires_at },
 *     pat:     { token, id, scopes, expires_at }   <- token shown ONCE
 *   }
 *
 * `pat.token` is what gets persisted. The `access_token` fallback covers a
 * plain OAuth-shaped body (an endpoint that returns no PAT envelope), so the
 * adapter degrades to the generic contract instead of returning an empty
 * token. PATs carry no expiry by default: the freshness hint falls back to
 * `expires_in`, then to 30 days.
 */
export function extractTokenFromResponse(
  body: Record<string, unknown>,
  _context: ApiLoginContext,
): ExtractedToken {
  const pat = (body.pat ?? {}) as Record<string, unknown>;
  const session = (body.session ?? {}) as Record<string, unknown>;

  const expiresAt = pat.expires_at ?? session.expires_at;
  const expiresIn = typeof expiresAt === 'number'
    ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
    : Number(body.expires_in ?? PAT_DEFAULT_TTL_SECONDS);

  const refreshToken = session.refresh_token ?? body.refresh_token;

  return {
    accessToken: String(pat.token ?? body.access_token ?? ''),
    tokenType: String(body.token_type ?? 'Bearer'),
    expiresIn,
    refreshToken: refreshToken ? String(refreshToken) : null,
  };
}
