"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { recommendEvents } from '@/ai/flows/recommend-events';
import { getUserRegistrations, getEventsByIds, getEvents } from '@/lib/firebase/firestore';
import type { CampusEvent } from '@/lib/types';
import { EventList } from '@/components/events/EventList';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Spinner } from '@/components/Spinner';
import { EventCard } from '@/components/events/EventCard';

export function DashboardClient({ allEvents: initialAllEvents }: { allEvents: CampusEvent[] }) {
  const { user } = useAuth();
  const [recommendedEventsList, setRecommendedEventsList] = useState<CampusEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CampusEvent[]>(initialAllEvents);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      if (user) {
        try {
          const registrations = await getUserRegistrations(user.uid);
          const registeredEventIds = registrations.map(reg => reg.eventId);
          
          if (registeredEventIds.length > 0) {
            const registeredEvents = await getEventsByIds(registeredEventIds);
            const registeredEventTitles = registeredEvents.map(event => event.title);
            
            const recommendationResult = await recommendEvents({ registeredEvents: registeredEventTitles });
            
            const allEventsFromDb = await getEvents();
            
            const recommended = allEventsFromDb.filter(event => 
                recommendationResult.recommendedEvents.includes(event.title) && !registeredEventIds.includes(event.id)
            );
            
            setRecommendedEventsList(recommended);
          }
        } catch (error) {
          console.error("Failed to fetch recommendations:", error);
        } finally {
          setLoadingRecs(false);
        }
      } else {
        setLoadingRecs(false);
      }
    }

    fetchRecommendations();
  }, [user]);

  return (
    <div className="space-y-12">
      {loadingRecs ? (
         <div className="space-y-4">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Suggested for You</h2>
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        </div>
      ) : recommendedEventsList.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Suggested for You</h2>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {recommendedEventsList.map(event => (
                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                     <EventCard event={event} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold tracking-tight">Upcoming Events</h2>
        <EventList events={allEvents} />
      </div>
    </div>
  );
}
