/**
 * Next.js instrumentation hook — runs once when the server process starts,
 * regardless of runtime. Used here only for M38's Environment Validation
 * stage (see lib/environment-variables.ts); it must never run in the edge
 * runtime, which does not share the same process.env semantics.
 *
 * Next.js itself only logs a thrown register() error internally ("Failed
 * to prepare server") and then keeps the process alive, serving 500s to
 * every request forever rather than actually exiting — worse than a clean
 * failure for a container orchestrator, which needs a real, non-zero exit
 * to know the instance is unhealthy and act on it (per M36's Rapid
 * Detection and M38's Environment Validation). Catching the error here and
 * calling process.exit(1) makes misconfiguration fail the same way a
 * crashed process would.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { validateWebEnvironment } = await import('./lib/environment-variables');

  try {
    validateWebEnvironment(process.env);
  } catch (error) {
    console.error(
      '[environment-validation] Refusing to start:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}
