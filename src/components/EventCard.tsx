
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

interface EventCardProps {
  event: EventData & { time?: string }; // time is optional and for display only
}

export function EventCard({ event }: EventCardProps) {
    
  const eventDate = event.date ? event.date.toDate() : new Date();
  const displayTime = event.time || eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
                src={event.posterUrl}
                alt={event.title}
                fill
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
        <Button className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
}
