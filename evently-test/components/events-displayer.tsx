'use client';

import { EventCard } from '@/components/ui/event-card';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';

type EventData = {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  maxcapacity: number;
};

export function EventsDisplayer() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    }

    fetchEvents();
  }, []);

  // Filtramos los eventos en base al término de búsqueda
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="flex-col p-10 justify-center space-y-10">
        <div className="w-full flex justify-center">
          <Input
            placeholder="Filter events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event: EventData) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                price={event.price}
                maxcapacity={event.maxcapacity}
              />
            ))
          ) : (
            <div>No events found</div>
          )}
        </div>
      </div>
    </>
  );
}
