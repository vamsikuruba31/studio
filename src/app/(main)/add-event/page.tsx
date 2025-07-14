
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export default function AddEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to add an event.", variant: "destructive" });
        setLoading(false);
        return;
    }
    if (!title.trim() || !description.trim() || !date || !time || !department) {
        toast({ title: "Validation Error", description: "Please fill out all required fields.", variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      let posterUrl = "https://placehold.co/600x400.png";
      
      if (posterFile) {
        const posterPath = `posters/${Date.now()}_${posterFile.name}`;
        posterUrl = await uploadFile(posterFile, posterPath, user);
      }
      
      const eventData = {
        title,
        description,
        date, 
        time,
        department,
        posterUrl,
        createdBy: user.uid,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      };
      
      await addEvent(eventData);

      toast({
        title: "Success!",
        description: "Your event has been added.",
      });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Error adding event:", error);
      toast({
        title: "Error Adding Event",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline mb-4">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="e.g., AI for Beginners" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="description">Event Description</Label>
            <Textarea id="description" placeholder="Describe your event..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-2">
                <Label>Event Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "pl-3 text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="time">Event Time</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Label>Department</Label>
                <Select onValueChange={setDepartment} value={department}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" placeholder="e.g., tech, workshop, ai" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="poster">Event Poster (Optional)</Label>
            <Input 
                id="poster"
                type="file" 
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setPosterFile(file);
                    }
                }}
            />
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? <Spinner size="sm" /> : "Add Event"}
        </Button>
      </form>
    </div>
  );
}
