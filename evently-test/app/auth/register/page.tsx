import React from 'react';

import { SignupForm } from '@/components/signup-form';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/events');
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  );
}
