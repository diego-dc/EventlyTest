import { BellRing, Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

type EventCardProps = React.ComponentProps<typeof Card> & {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  maxCapacity: number;
};

export function EventCard({ className, ...props }: EventCardProps) {
  const router = useRouter(); // Hook de navegación

  const handleButtonClick = () => {
    router.push(`/events/${props.id}`); // Redirige a la página del evento
  };
  return (
    <Card className={cn('w-[320px]', className)} {...props}>
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
      <CardFooter>
        <Button className="w-full" onClick={handleButtonClick}>
          <Check /> Buy Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
