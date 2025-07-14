
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/Spinner";
import { addEvent } from "@/lib/firebase/firestore";
import { uploadFile } from "@/lib/firebase/storage";

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)."),
  department: z.string().min(1, "Please select a department."),
  tags: z.string().optional(),
  poster: z.instanceof(File).refine(file => file.size > 0, "A poster image is required."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function AddEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      time: "",
      department: "",
      tags: "",
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to add an event.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      const posterPath = `events/${Date.now()}_${data.poster.name}`;
      const posterUrl = await uploadFile(data.poster, posterPath);

      // Combine date and time into a single Date object
      const [hours, minutes] = data.time.split(':');
      const eventDate = new Date(data.date);
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      const eventData = {
        title: data.title,
        description: data.description,
        date: eventDate, // This is now a correct Date object
        time: data.time,
        department: data.department,
        posterUrl,
        createdBy: user.uid,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      await addEvent(eventData);

      toast({
        title: "Success!",
        description: "Your event has been added.",
      });
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error adding event",
        description: error.message,
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline mb-4">Add New Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., AI for Beginners" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Describe your event..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                format(field.value, "PPP")
                                ) : (
                                <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                            initialFocus
                            />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Time</FormLabel>
                        <FormControl>
                        <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                            <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                            <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                            <SelectItem value="Business Administration">Business Administration</SelectItem>
                            <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., tech, workshop, ai" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="poster"
                render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                    <FormLabel>Event Poster</FormLabel>
                    <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                onChange(file);
                            }
                        }}
                        {...rest}
                     />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" /> : "Add Event"}
            </Button>
        </form>
      </Form>
    </div>
  );
}

    