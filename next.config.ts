import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy, set without a nonce.
//
// The nonce-based policy in the Next.js CSP guide is stricter, but it forces
// every page into dynamic rendering. We are not paying that cost for a
// read-only demo. The trade-off is `'unsafe-inline'` on script-src, which is
// required because the App Router injects inline hydration and Flight scripts,
// and which materially weakens the XSS protection this header would otherwise
// give. The rest of the policy still does real work: `object-src 'none'`,
// `base-uri 'self'`, and `form-action 'self'` block plugin, base-tag, and
// form-retarget injection regardless.
//
// Before this handles real client data, move to the nonce-based policy in a
// `proxy.ts` (Next 16 renamed middleware to proxy) or turn on experimental SRI.
// `'unsafe-eval'` is development-only; React uses eval there to rebuild
// server-side error stacks in the browser.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Do not advertise the framework and version to scanners.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Share links carry their bearer token in the URL path, so any referrer
        // disclosure leaks the credential itself. `strict-origin-when-cross-origin`
        // would still send the full path on same-origin navigations. Send nothing.
        // Last matching rule wins, so this overrides the Referrer-Policy above.
        source: "/share/:token*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
