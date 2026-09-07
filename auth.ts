/**
 * Auth.js with the Drizzle adapter: identity and roles stay in our Postgres,
 * which is what the Ontario privacy posture requires.
 *
 * Email magic link only. With AUTH_EMAIL_SERVER unset, Auth.js prints the
 * sign-in URL to the server console, which is enough for local development.
 */
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";

import { db } from "@/src/db";
import { accounts, sessions, users, verificationTokens } from "@/src/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  providers: [
    Nodemailer({
      server: process.env.AUTH_EMAIL_SERVER ?? { jsonTransport: true },
      from: process.env.AUTH_EMAIL_FROM ?? "no-reply@localhost",
    }),
  ],
  pages: {},
});
