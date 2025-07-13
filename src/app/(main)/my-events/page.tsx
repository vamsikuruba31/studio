"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getUserRegistrations, getEventsByIds } from '@/lib/firebase/firestore';
import type { CampusEvent } from '@/lib/types';
import { EventList } from '@/components/events/EventList';
import { Spinner } from '@/components/Spinner';

export default function MyEventsPage() {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (user) {
        try {
          const registrations = await getUserRegistrations(user.uid);
          const eventIds = registrations.map(reg => reg.eventId);
          if (eventIds.length > 0) {
            const events = await getEventsByIds(eventIds);
            setRegisteredEvents(events);
          }
        } catch (error) {
          console.error("Failed to fetch registered events:", error);
        }
      }
      setLoading(false);
    };

    fetchRegisteredEvents();
  }, [user]);

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">My Registered Events</h1>
      {loading ? (
        <div className="flex justify-center pt-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <EventList events={registeredEvents} />
      )}
    </div>
  );
}
