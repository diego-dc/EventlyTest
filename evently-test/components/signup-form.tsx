'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the schema for the form
export const SignupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  role: z.string().optional().default('user'),
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();

  const signUpForm = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signUp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      },
    );

    const data = await response.json();

    console.log('Data:', data);

    if (response.ok) {
      // Si la respuesta es exitosa
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });

      router.push(`/auth/login`);
    } else {
      // Si hay un error
      toast({
        className: 'bg-red-500 text-white',
        title: 'Error',
        description: 'Error creating account',
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Specify your data below to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="User Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Username@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline">
                Log in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
