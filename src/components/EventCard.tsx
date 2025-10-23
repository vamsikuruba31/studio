
"use client";

import Image from "next/image";
import type { EventData } from "@/types/event";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
    
  // Normalize event.date to a JS Date object (some sources may return ISO string)
  const eventDateRaw = event.date as any;
  const eventDate = eventDateRaw instanceof Date ? eventDateRaw : new Date(eventDateRaw || Date.now());
  const displayTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
                src={event.posterUrl}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-lg"
                data-ai-hint="event poster"
            />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2">
        <CardTitle className="text-xl font-headline">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{displayTime}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
             <Tag className="mr-2 h-4 w-4 flex-shrink-0" />
             <span>{event.department}</span>
        </div>
         {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4">
        <EventActions event={event} />
      </CardFooter>
    </Card>
  );
}

function EventActions({ event }: { event: EventData }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!user) return alert('Please log in to register');
    setLoading(true);
    try {
      const res = await fetch('/api/events/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId: event.id, userUid: user.uid, userName: (event as any).creatorName || '', userEmail: user.email }) });
      if (!res.ok) throw new Error('Could not register');
      alert('Registered successfully');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRegistrants = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}`);
      if (!res.ok) throw new Error('Could not fetch registrants');
      const json = await res.json();
      const list = (json.registrants || []).map((r: any) => `${r.userName || r.userEmail || r.userUid}`).join('\n') || 'No registrants';
      alert(list);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      alert('Event deleted');
      // simple page reload to refresh events
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Delete failed');
    }
  };

  const isCreator = user && event.createdBy && user.uid === event.createdBy;

  return (
    <div className="w-full flex gap-2">
      <Button className="flex-1" onClick={handleRegister} disabled={loading}>{loading ? '...' : 'Register'}</Button>
      {isCreator && (
        <>
          <Button variant="ghost" onClick={handleViewRegistrants}>View</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </>
      )}
    </div>
  );
}
