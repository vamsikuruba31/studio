"use client";

import type { CampusEvent } from '@/lib/types';
import { EventCard } from './EventCard';

interface EventListProps {
  events: CampusEvent[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return <p className="text-center text-muted-foreground">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
