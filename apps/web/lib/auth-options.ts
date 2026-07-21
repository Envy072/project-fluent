import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AuthResponse } from '@project-fluent/api-contracts';

/**
 * Auth.js integration point wired into the Identity & Access Module (ADR-005,
 * Platform Foundation Scaffold Plan). Auth.js owns the browser session
 * cookie's UX (secure cookie storage, sign-in/sign-out mechanics); the
 * NestJS API remains the sole authority on credential verification and
 * Authentication State (per M22) — `authorize()` below never checks
 * credentials itself, it only forwards them to the API and trusts its
 * response.
 */

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as AuthResponse;
        return {
          id: data.user.id,
          email: data.user.email,
          accessToken: data.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.accessToken = (user as { accessToken: string }).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
