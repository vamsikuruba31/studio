"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getEventById, checkIfRegistered, registerForEvent } from '@/lib/firebase/firestore';
import type { CampusEvent } from '@/lib/types';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, Building, CheckCircle } from 'lucide-react';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<CampusEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(params.id);
        setEvent(eventData);
      } catch (e) {
        console.error("Error fetching event:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (user && event) {
        setIsCheckingRegistration(true);
        const registered = await checkIfRegistered(user.uid, event.id);
        setIsRegistered(registered);
        setIsCheckingRegistration(false);
      } else {
        setIsCheckingRegistration(false);
      }
    };
    checkRegistration();
  }, [user, event]);
  
  const handleRegister = async () => {
    if (!user || !event) return;
    setIsRegistering(true);
    try {
      await registerForEvent(user.uid, event.id);
      setIsRegistered(true);
      toast({ title: "Successfully Registered!" });
    } catch (e) {
      toast({ title: "Registration Failed", variant: 'destructive' });
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!event) {
    return <div className="text-center">Event not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-lg bg-card shadow-lg">
        <div className="relative h-64 w-full md:h-96">
          <Image
            src={event.posterUrl || `https://placehold.co/1200x600.png`}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="event poster"
          />
        </div>
        <div className="p-6 md:p-8">
          <h1 className="font-headline text-3xl font-bold md:text-4xl">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
            <div className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</div>
            <div className="flex items-center"><Clock className="mr-2 h-4 w-4" /> {event.time}</div>
            <div className="flex items-center"><Building className="mr-2 h-4 w-4" /> {event.department}</div>
          </div>
          <p className="mt-6 text-base leading-relaxed">{event.description}</p>
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            {isCheckingRegistration ? (
                <Button className="w-full md:w-auto" size="lg" disabled><Spinner size="sm" /></Button>
            ) : isRegistered ? (
                <Button className="w-full md:w-auto" size="lg" variant="secondary" disabled><CheckCircle className="mr-2 h-4 w-4" />Registered</Button>
            ) : (
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground md:w-auto" size="lg" onClick={handleRegister} disabled={isRegistering}>
                    {isRegistering ? <Spinner size="sm" /> : 'Register for this Event'}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
