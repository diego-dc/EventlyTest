'use client';

import { EventCard } from '@/components/ui/event-card';
import { useState, useEffect } from 'react';

type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  maxCapacity: number;
};

export function EventsDisplayer() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex p-10 justify-center">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            price={event.price}
            maxCapacity={event.maxCapacity}
          />
        ))}
      </div>
    </div>
  );
}
