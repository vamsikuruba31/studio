
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { CalendarIcon, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/Spinner";
import { addEvent } from "@/lib/firebase/firestore";
import { uploadFile } from "@/lib/firebase/storage";
import type { EventDataInput } from "@/types/event";
import { Card, CardContent } from "@/components/ui/card";

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
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
  }

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [posterPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to add an event.", variant: "destructive" });
        return;
    }
    
    if (!title.trim() || !description.trim() || !date || !time || !department) {
        toast({ title: "Validation Error", description: "Please fill out all required fields, including date and time.", variant: "destructive" });
        return;
    }
    setLoading(true);

    try {
      let posterUrl = "https://placehold.co/600x400.png";

      if (posterFile) {
        try {
            const posterPath = `events/${user.uid}/${Date.now()}_${posterFile.name}`;
            posterUrl = await uploadFile(posterFile, posterPath);
        } catch (err: any) {
            toast({
                title: "Poster Upload Failed",
                description: err.message || "An unexpected error occurred during upload. Please try again.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }
      }

      const [hours, minutes] = time.split(':').map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hours, minutes, 0, 0);

      const eventData: EventDataInput = {
        title,
        description,
        date: combinedDate,
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

  const isFormInvalid = !title.trim() || !description.trim() || !date || !time || !department;

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

        <div className="space-y-2">
            <Label>Event Poster</Label>
             <Card>
                <CardContent className="p-4">
                  {posterPreview ? (
                    <div className="relative group w-full aspect-video">
                      <Image
                        src={posterPreview}
                        alt="Poster preview"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-md"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button type="button" size="icon" variant="destructive" onClick={handleRemovePoster}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove poster</span>
                         </Button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="poster" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 5MB)</p>
                        </div>
                         <Input id="poster" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                    </label>
                  )}
                </CardContent>
            </Card>
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

        <Button type="submit" disabled={loading || isFormInvalid} className="w-full sm:w-auto">
            {loading ? <Spinner size="sm" /> : "Add Event"}
        </Button>
      </form>
    </div>
  );
}

    