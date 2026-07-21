import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { SignOutButton } from '@/components/sign-out-button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <p>Authenticated successfully.</p>
      <p>{session.user?.email}</p>
      <SignOutButton />
    </main>
  );
}
