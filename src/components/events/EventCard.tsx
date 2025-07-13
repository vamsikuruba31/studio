"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampusEvent } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { registerForEvent, checkIfRegistered } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/Spinner';

interface EventCardProps {
  event: CampusEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        try {
          const registered = await checkIfRegistered(user.uid, event.id);
          setIsRegistered(registered);
        } catch (error) {
          console.error("Failed to check registration status", error);
        }
      }
      setIsLoading(false);
    };
    checkRegistration();
  }, [user, event.id]);

  const handleRegister = async () => {
    if (!user) {
      toast({ title: 'Please login to register', variant: 'destructive' });
      return;
    }
    setIsRegistering(true);
    try {
      await registerForEvent(user.uid, event.id);
      setIsRegistered(true);
      toast({ title: 'Successfully registered!', description: `You are now registered for ${event.title}.` });
    } catch (error) {
      toast({ title: 'Registration failed', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/event/${event.id}`} className="block group">
        <div className="relative h-48 w-full">
          <Image
            src={event.posterUrl || `https://placehold.co/600x400.png`}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="event poster"
          />
        </div>
      </Link>
      <CardHeader>
        <Link href={`/event/${event.id}`} className="block">
          <CardTitle className="font-headline text-xl leading-tight hover:text-primary">{event.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          <span>{event.time}</span>
        </div>
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-center pt-2">
             <Tag className="mr-2 h-4 w-4" />
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 3).map(tag => (
                <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isLoading ? (
          <Button className="w-full" disabled>
            <Spinner size="sm"/>
          </Button>
        ) : isRegistered ? (
          <Button className="w-full" variant="secondary" disabled>
            <CheckCircle className="mr-2 h-4 w-4" />
            Registered
          </Button>
        ) : (
          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleRegister} disabled={isRegistering}>
            {isRegistering ? <Spinner size="sm"/> : 'Register'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
