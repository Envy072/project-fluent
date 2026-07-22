'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  EnglishLevel,
  LearningGoal,
  type LearningConfigurationResponse,
} from '@project-fluent/api-contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const ENGLISH_LEVELS = Object.values(EnglishLevel);
const LEARNING_GOALS = Object.values(LearningGoal);

function formatLearningGoal(goal: LearningGoal): string {
  return goal
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

type LoadState = 'loading' | 'loaded';

export function PreferencesForm() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [hasExistingConfiguration, setHasExistingConfiguration] = useState(false);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(EnglishLevel.A1);
  const [learningGoal, setLearningGoal] = useState<LearningGoal>(LearningGoal.GENERAL_ENGLISH);
  const [useOneTopicForAllSkills, setUseOneTopicForAllSkills] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let cancelled = false;

    async function loadConfiguration() {
      const response = await fetch(`${API_URL}/learning-configuration`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (cancelled) {
        return;
      }

      if (response.ok) {
        const config = (await response.json()) as LearningConfigurationResponse;
        setHasExistingConfiguration(true);
        setEnglishLevel(config.englishLevel);
        setLearningGoal(config.learningGoal);
        setUseOneTopicForAllSkills(config.useOneTopicForAllSkills);
      } else {
        setHasExistingConfiguration(false);
      }

      setLoadState('loaded');
    }

    void loadConfiguration();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const response = await fetch(`${API_URL}/learning-configuration`, {
      method: hasExistingConfiguration ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ englishLevel, learningGoal, useOneTopicForAllSkills }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        message?: string | string[];
      } | null;
      const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
      setError(message ?? 'Something went wrong while saving your preferences.');
      return;
    }

    setHasExistingConfiguration(true);
    setSuccessMessage('Your learning preferences have been saved.');
  }

  async function handleDelete() {
    if (!accessToken) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const response = await fetch(`${API_URL}/learning-configuration`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setIsSubmitting(false);
    setIsConfirmingDelete(false);

    if (!response.ok) {
      setError('Something went wrong while deleting your preferences.');
      return;
    }

    setHasExistingConfiguration(false);
    setEnglishLevel(EnglishLevel.A1);
    setLearningGoal(LearningGoal.GENERAL_ENGLISH);
    setUseOneTopicForAllSkills(true);
    setSuccessMessage('Your learning preferences have been deleted.');
  }

  if (loadState === 'loading') {
    return <p>Loading your preferences…</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '20rem' }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        English Level
        <select
          value={englishLevel}
          onChange={(event) => setEnglishLevel(event.target.value as EnglishLevel)}
        >
          {ENGLISH_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        Learning Goal
        <select
          value={learningGoal}
          onChange={(event) => setLearningGoal(event.target.value as LearningGoal)}
        >
          {LEARNING_GOALS.map((goal) => (
            <option key={goal} value={goal}>
              {formatLearningGoal(goal)}
            </option>
          ))}
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={useOneTopicForAllSkills}
          onChange={(event) => setUseOneTopicForAllSkills(event.target.checked)}
        />
        Use one topic for all skills
      </label>

      {error ? (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      ) : null}
      {successMessage ? <p style={{ color: 'green' }}>{successMessage}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save'}
      </button>

      {hasExistingConfiguration ? (
        isConfirmingDelete ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={handleDelete} disabled={isSubmitting}>
              Confirm Delete
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setIsConfirmingDelete(true)} disabled={isSubmitting}>
            Delete Preferences
          </button>
        )
      ) : null}
    </form>
  );
}
