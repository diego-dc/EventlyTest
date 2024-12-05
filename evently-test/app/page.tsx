import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect them to the `/events` page.
  redirect('/auth/login');
}
