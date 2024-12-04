'use client';

import React from 'react';

import { SignupForm } from '@/components/signup-form';
import NextAuth, { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/content');
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  );
};
