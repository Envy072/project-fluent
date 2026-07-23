'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ProgressOutcome,
  type MostRecentOutcomeResponse,
  type SessionResponse,
} from '@project-fluent/api-contracts';
import { saveActiveSession } from '@/lib/active-session-storage';
import { PreferencesForm } from './preferences-form';
import { SignOutButton } from './sign-out-button';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function describeOutcome(progress: MostRecentOutcomeResponse): string {
  if (!progress.hasGeneratedSession) {
    return "You haven't generated a session yet.";
  }
  switch (progress.outcome) {
    case ProgressOutcome.COMPLETED:
      return 'Your last session was completed.';
    case ProgressOutcome.INCOMPLETE:
      return 'Your last session was left incomplete.';
    case ProgressOutcome.PENDING:
      return 'You have a session in progress.';
  }
}

export function DashboardView() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();

  const [progress, setProgress] = useState<MostRecentOutcomeResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadProgress() {
      const response = await fetch(`${API_URL}/progress/latest`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (cancelled || !response.ok) {
        return;
      }
      setProgress((await response.json()) as MostRecentOutcomeResponse);
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleGenerate() {
    if (!accessToken) {
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsGenerating(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setGenerationError(body?.message ?? 'Could not generate a session right now.');
      return;
    }

    const generatedSession = (await response.json()) as SessionResponse;
    saveActiveSession(generatedSession);
    router.push('/session');
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '1.5rem',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <h1>Dashboard</h1>
      <p>{session?.user?.email}</p>

      <section
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <h2>Generate a Session</h2>
        <button type="button" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : 'Generate Session'}
        </button>
        {generationError ? (
          <p role="alert" style={{ color: 'crimson' }}>
            {generationError}
          </p>
        ) : null}
      </section>

      <section
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <h2>Learning Configuration</h2>
        <PreferencesForm />
      </section>

      <section>
        <h2>Progress</h2>
        <p>{progress ? describeOutcome(progress) : 'Loading…'}</p>
      </section>

      <SignOutButton />
    </main>
  );
}
