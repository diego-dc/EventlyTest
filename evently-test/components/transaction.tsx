'use client';

import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the props for the Transaction component
type TransactionProps = React.ComponentProps<typeof Card> & {
  event_id: number;
  title: string;
  date: string;
  description: string;
  price: number;
  maxcapacity: number;
};

// Define the schema for the form
export const TransactionFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Title must be at least 4 characters long.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Description must be at least 10 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  tickets: z
    .string()
    .min(0, { message: 'tickets must be a positive number.' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, {
      message: 'Max capacity must be a positive number.',
    }),
});

export function TransactionComponent({
  className,
  ...props
}: TransactionProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Initialize the form using react-hook-form with Zod validation
  const transactionForm = useForm<z.infer<typeof TransactionFormSchema>>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      tickets: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof TransactionFormSchema>) {
    // Ask for confirmation before submitting the transaction to the server. A simple version for now
    const confirmed = window.confirm(
      'Are you sure you want to submit this transaction?',
    );

    if (confirmed) {
      // Calculate the amount of the transaction
      const amount = values.tickets * props.price; // TODO: get the price from the db

      // Send the transaction to the server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...values, ...props, amount }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // If the response is successful, show a success toast
        toast({
          title: 'Success',
          description: 'The payment was successfully',
        });

        router.push(`/events`);
      }
      if (response.status === 400 || data.error) {
        // If the response is not successful, show a error toast
        toast({
          className: 'bg-red-500 text-white',
          title: 'Error',
          description: data.message,
        });
      } else {
        // If there is an error, show an error toast
        toast({
          className: 'bg-red-500 text-white',
          title: 'Error',
          description: 'Error during the payment',
        });
      }
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Buy tickets</CardTitle>
        <CardDescription>
          Fill in the form below to buy tickets for the event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className={cn('w-full', className)} {...props}>
          <CardHeader>
            <p className="text-slate-600 text-[14px] flex">
              <CalendarIcon className="me-1 h-5" /> {props.date}
            </p>
            <CardTitle className="text-2xl">{props.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {props.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="w-full text-end ">
              <p className="text-xl">$ {props.price}</p>
            </div>
          </CardContent>
        </Card>
        <Form {...transactionForm}>
          <form onSubmit={transactionForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4 mt-8">
              <FormField
                control={transactionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name User" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name of the person buying the tickets.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Last name of the person buying the tickets.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
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
                control={transactionForm.control}
                name="tickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tickets</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" min="1" {...field} />
                    </FormControl>
                    <FormDescription>Amaunt of tickets to buy.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Buy Tickets
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TransactionComponent;
