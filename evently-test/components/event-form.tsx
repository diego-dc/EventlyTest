'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';

import { format } from 'date-fns';

import Link from 'next/link';

import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the schema for the form
export const EventFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 4 characters long.' })
    .trim(),
  description: z
    .string()
    .min(2, { message: 'Description must be at least 10 characters long.' })
    .trim(),
  date: z.date().min(new Date(), { message: 'Date must be in the future.' }),
  price: z
    .string()
    .min(0, { message: 'Price must be a positive number.' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, {
      message: 'Max capacity must be a positive number.',
    }),
  maxCapacity: z
    .string()
    .min(0, { message: 'Max capacity must be a positive number.' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0, {
      message: 'Max capacity must be a positive number.',
    }),
});

export function EventForm() {
  const router = useRouter();
  const { toast } = useToast();

  const eventForm = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      price: 0,
      maxCapacity: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof EventFormSchema>) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
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
        description: 'Event created successfully',
      });

      // Redireccionar a otra página, por ejemplo, la página del evento

      router.push(`/events`); // Cambia el path según tu necesidad
    } else {
      // Si hay un error
      toast({
        className: 'bg-red-500 text-white',
        title: 'Error',
        description: 'Error creating event',
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create an event</CardTitle>
        <CardDescription>
          Fill in the form below to create an event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...eventForm}>
          <form onSubmit={eventForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={eventForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of the event." {...field} />
                    </FormControl>
                    <FormDescription>
                      Title your event in a few words.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description of the event."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a description for the event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() && date < new Date('3000-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the date of the event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Price of the event's ticket.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max. Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      The maximum amount of people your event can hold.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Event
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
