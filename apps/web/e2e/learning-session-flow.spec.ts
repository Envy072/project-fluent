import { test, expect, type Page } from '@playwright/test';

/**
 * Closes a Sprint 10 (Phase 10, Production Readiness) Gate 4 gap: prior to
 * this file, nothing exercised the Learning Session Page's own Presentation
 * Layer logic (M19) — part ordering, topic lookup, engagement recording,
 * completion, and abandonment — through a real browser. Only the Learning
 * Session Page's access guard was e2e-tested (learning-session-access.spec.ts)
 * and the Session Generation → Composition lifecycle was verified server-side
 * only (apps/api/test/learning-engine.integration.test.ts, mocked AI client).
 *
 * Every environment's ANTHROPIC_API_KEY remains a placeholder (see
 * docs/engineering/release-readiness-report.md), so a real Session cannot be
 * generated end-to-end here. Instead, only the AI-dependent `/sessions`
 * endpoints are intercepted at the browser network boundary (Playwright
 * `page.route`) with a realistic, well-formed SessionResponse fixture — the
 * same "swap the AI boundary, exercise everything else for real" approach
 * already established server-side. This verifies the real Next.js pages,
 * routing, and client-side state handling (M19's View, Interaction, State,
 * and Navigation Layers) — it does not re-verify AI Output Validation, which
 * apps/api/test/ai-integration.service.test.ts already covers at the
 * correct Verification Level (M23's Testing Pyramid).
 */

const FLOW_TEST_EMAIL = 'e2e-session-flow-user@example.com';
const FLOW_TEST_PASSWORD = 'correct-horse-battery-staple';
const API_URL = process.env.API_URL ?? 'http://localhost:4000';
const SESSION_ID = 'e2e-mocked-session-id';

const PART_NAMES = [
  'READING',
  'LISTENING',
  'SPEAKING',
  'WRITING',
  'VOCABULARY',
  'GRAMMAR',
  'QUIZ',
] as const;

function fixtureSession() {
  const now = new Date().toISOString();
  return {
    id: SESSION_ID,
    state: 'GENERATED',
    englishLevel: 'B1',
    learningGoal: 'BUSINESS',
    useOneTopicForAllSkills: true,
    topics: [{ subjectMatter: 'Renewable Energy', assignmentScope: 'SESSION' }],
    compositionParts: PART_NAMES.map((part) => ({
      part,
      content: `Sample ${part} content for the mocked Session.`,
      engagementStatus: 'NOT_STARTED',
    })),
    createdAt: now,
    updatedAt: now,
  };
}

async function mockSessionGeneration(page: Page): Promise<void> {
  await page.route(`${API_URL}/sessions`, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(fixtureSession()),
    });
  });
}

async function mockSessionEngagementAndCompletion(page: Page): Promise<void> {
  await page.route(`${API_URL}/sessions/*/parts/*/engagement`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.route(`${API_URL}/sessions/*/complete`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

async function mockSessionAbandonment(page: Page): Promise<void> {
  await page.route(`${API_URL}/sessions/*/abandon`, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill(FLOW_TEST_EMAIL);
  await page.getByLabel('Password').fill(FLOW_TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe.serial('Learning Session Flow (Presentation Layer, M05)', () => {
  test.beforeAll(async () => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: FLOW_TEST_EMAIL, password: FLOW_TEST_PASSWORD }),
    });
    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to provision the session-flow test account: ${response.status}`);
    }
  });

  test('generates a Session and completes all seven parts through to the Dashboard', async ({
    page,
  }) => {
    await mockSessionGeneration(page);
    await mockSessionEngagementAndCompletion(page);
    await login(page);

    await page.getByRole('button', { name: 'Generate Session' }).click();
    await expect(page).toHaveURL(/\/session/);

    for (const [index, part] of PART_NAMES.entries()) {
      await expect(page.getByText(`Part ${index + 1} of ${PART_NAMES.length}`)).toBeVisible();
      await expect(
        page.getByRole('heading', { name: part.charAt(0) + part.slice(1).toLowerCase() }),
      ).toBeVisible();

      const isLastPart = index === PART_NAMES.length - 1;
      await page.getByRole('button', { name: isLastPart ? 'Complete Session' : 'Next' }).click();
    }

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('abandons a Session via Leave Session and returns to the Dashboard', async ({ page }) => {
    await mockSessionGeneration(page);
    await mockSessionEngagementAndCompletion(page);
    await mockSessionAbandonment(page);
    await login(page);

    await page.getByRole('button', { name: 'Generate Session' }).click();
    await expect(page).toHaveURL(/\/session/);

    await page.getByRole('button', { name: 'Leave Session' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Session Generation Unavailable: stays on the Dashboard with Configuration intact', async ({
    page,
  }) => {
    await page.route(`${API_URL}/sessions`, async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Session generation is temporarily unavailable.' }),
      });
    });
    await login(page);

    await expect(page.getByRole('heading', { name: 'Learning Configuration' })).toBeVisible();

    await page.getByRole('button', { name: 'Generate Session' }).click();

    await expect(page.getByText('Session generation is temporarily unavailable.')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Learning Configuration' })).toBeVisible();
  });
});
