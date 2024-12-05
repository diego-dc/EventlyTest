import React from 'react';

import { LoginForm } from '@/components/login-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function Page() {
  // Fetch the user's session using `getServerSession` and the provided `authOptions`.
  const session = await getServerSession(authOptions);

  // If the user is already logged in, redirect them to the `/events` page.
  if (session) {
    redirect('/events');
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
