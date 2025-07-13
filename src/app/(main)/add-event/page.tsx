"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { uploadFile } from '@/lib/firebase/storage';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestEventCaption } from '@/ai/flows/suggest-event-caption';
import { Wand2 } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import Image from 'next/image';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  department: z.string().min(1, 'Department is required'),
  tags: z.string(),
  poster: z.any(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function AddEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });
  
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterPreview(URL.createObjectURL(file));
      setValue('poster', e.target.files);
    }
  };

  const handleSuggestCaption = async () => {
    setGenerating(true);
    const { title, description, department } = getValues();
    try {
      const result = await suggestEventCaption({
        eventTitle: title,
        eventDescription: description,
        eventDepartment: department,
      });
      setValue('description', result.caption);
    } catch (error) {
      console.error('AI suggestion failed', error);
      toast({ title: 'AI Suggestion Failed', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };
  
  const onSubmit = async (data: EventFormValues) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create an event.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      let posterUrl = '';
      if (data.poster && data.poster.length > 0) {
        const posterFile = data.poster[0];
        const filePath = `event-posters/${Date.now()}_${posterFile.name}`;
        posterUrl = await uploadFile(posterFile, filePath);
      }

      await addDoc(collection(db, 'events'), {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        department: data.department,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        posterUrl,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Event Created!", description: "Your event has been successfully created." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Add New Event</h1>
      <p className="mt-2 text-muted-foreground">Fill in the details below to create a new campus event.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleSuggestCaption} disabled={generating}>
              {generating ? <Spinner size="sm" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Suggest Caption
            </Button>
          </div>
          <Textarea id="description" {...register('description')} rows={5} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" {...register('time')} />
            {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Organizing Department</Label>
          <Input id="department" {...register('department')} />
          {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" placeholder="e.g., tech, workshop, networking" {...register('tags')} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="poster">Event Poster</Label>
          <Input id="poster" type="file" accept="image/*" onChange={handlePosterChange} />
          {posterPreview && (
            <div className="mt-4">
              <Image src={posterPreview} alt="Poster preview" width={200} height={100} className="rounded-md object-cover" />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Create Event'}
        </Button>
      </form>
    </div>
  );
}
