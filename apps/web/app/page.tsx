import Link from 'next/link';

export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        gap: '0.5rem',
      }}
    >
      <h1>Project Fluent</h1>
      <p>One complete English practice session, generated for you.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link href="/signup">Sign Up</Link>
        <Link href="/login">Sign In</Link>
      </div>
    </main>
  );
}
