'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  EngagementStatus,
  SessionCompositionPartName,
  TopicAssignmentScope,
  type SessionCompositionPartResponse,
  type SessionResponse,
  type TopicResponse,
} from '@project-fluent/api-contracts';
import { clearActiveSession, loadActiveSession } from '@/lib/active-session-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// M08 lists the seven Session Composition parts in this order every time it
// enumerates them, and is explicit that Quiz is "a concluding set of
// questions" — the exact relative order of the other six is left open by
// M47/M48, so this uses M08's own listing order as the least-invented choice.
const PART_ORDER: SessionCompositionPartName[] = [
  SessionCompositionPartName.READING,
  SessionCompositionPartName.LISTENING,
  SessionCompositionPartName.SPEAKING,
  SessionCompositionPartName.WRITING,
  SessionCompositionPartName.VOCABULARY,
  SessionCompositionPartName.GRAMMAR,
  SessionCompositionPartName.QUIZ,
];

function formatPartName(part: SessionCompositionPartName): string {
  return part.charAt(0) + part.slice(1).toLowerCase();
}

function orderParts(session: SessionResponse): SessionCompositionPartResponse[] {
  return PART_ORDER.map((part) => session.compositionParts.find((p) => p.part === part)).filter(
    (part): part is SessionCompositionPartResponse => part !== undefined,
  );
}

function findTopicForPart(
  session: SessionResponse,
  part: SessionCompositionPartName,
): TopicResponse | undefined {
  return session.topics.find(
    (topic) =>
      topic.assignmentScope === TopicAssignmentScope.SESSION ||
      (topic.assignmentScope as string) === (part as string),
  );
}

export default function SessionPage() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();

  const [activeSession, setActiveSession] = useState<SessionResponse | null>(null);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadActiveSession();
    if (!stored) {
      router.replace('/dashboard');
      return;
    }
    setActiveSession(stored);
  }, [router]);

  const orderedParts = activeSession ? orderParts(activeSession) : [];
  const currentPart = orderedParts[currentPartIndex];
  const isLastPart = currentPartIndex === orderedParts.length - 1;

  useEffect(() => {
    if (!accessToken || !activeSession || !currentPart) {
      return;
    }
    if (currentPart.engagementStatus !== EngagementStatus.NOT_STARTED) {
      return;
    }

    void fetch(`${API_URL}/sessions/${activeSession.id}/parts/${currentPart.part}/engagement`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ status: EngagementStatus.IN_PROGRESS }),
    });
    // Registers that the Learner has started engaging with this part
    // (M17's Engagement Status). Runs once per part shown — the
    // NOT_STARTED guard above prevents re-firing once already recorded.
  }, [currentPartIndex, accessToken, activeSession, currentPart]);

  async function handleAdvance() {
    if (!accessToken || !activeSession || !currentPart) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const engagementResponse = await fetch(
      `${API_URL}/sessions/${activeSession.id}/parts/${currentPart.part}/engagement`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status: EngagementStatus.REACHED_END }),
      },
    );

    if (!engagementResponse.ok) {
      setIsSubmitting(false);
      setError('Could not register your progress on this part. Please try again.');
      return;
    }

    if (!isLastPart) {
      setIsSubmitting(false);
      setCurrentPartIndex((index) => index + 1);
      return;
    }

    const completeResponse = await fetch(`${API_URL}/sessions/${activeSession.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsSubmitting(false);

    if (!completeResponse.ok) {
      setError('Could not complete the session. Please try again.');
      return;
    }

    clearActiveSession();
    router.push('/dashboard');
    router.refresh();
  }

  async function handleLeave() {
    if (!accessToken || !activeSession) {
      return;
    }

    setIsSubmitting(true);

    await fetch(`${API_URL}/sessions/${activeSession.id}/abandon`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsSubmitting(false);
    clearActiveSession();
    router.push('/dashboard');
    router.refresh();
  }

  if (!activeSession || !currentPart) {
    return <p>Loading…</p>;
  }

  const topic = findTopicForPart(activeSession, currentPart.part);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '1rem',
        padding: '2rem 1rem',
        textAlign: 'center',
      }}
    >
      <p>
        Part {currentPartIndex + 1} of {orderedParts.length}
      </p>
      {topic ? <p>Topic: {topic.subjectMatter}</p> : null}
      <h1>{formatPartName(currentPart.part)}</h1>
      <p style={{ maxWidth: '40rem' }}>{currentPart.content}</p>

      {error ? (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="button" onClick={handleAdvance} disabled={isSubmitting}>
          {isLastPart ? 'Complete Session' : 'Next'}
        </button>
        <button type="button" onClick={handleLeave} disabled={isSubmitting}>
          Leave Session
        </button>
      </div>
    </main>
  );
}
