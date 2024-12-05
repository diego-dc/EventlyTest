import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Si el usuario ya está autenticado, redirige a la página protegida
  redirect('/events');
}
