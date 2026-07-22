import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { PreferencesForm } from '@/components/preferences-form';

export default async function PreferencesPage() {
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
      <h1>Learning Preferences</h1>
      <PreferencesForm />
    </main>
  );
}
