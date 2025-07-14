
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
import { CalendarDays, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
    
  const eventDate = event.date ? new Date(event.date.seconds * 1000) : new Date();

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
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-headline mb-2">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {event.time}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
             <Tag className="mr-2 h-4 w-4" />
             <span>{event.department}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
}
