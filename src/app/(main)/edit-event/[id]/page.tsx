"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/Spinner";

export default function EditEventPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string | undefined>(undefined);
  const [time, setTime] = useState("");
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('not found');
        const json = await res.json();
        const event = json.event;
        setTitle(event.title || '');
        setDescription(event.description || '');
        if (event.date) {
          const d = new Date(event.date);
          setDate(d.toISOString().slice(0,10));
          setTime(d.toTimeString().slice(0,5));
        }
        setDepartment(event.department || '');
        setTags(event.tags ? event.tags.join(',') : '');
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Could not load event', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const d = new Date(date as string);
      d.setHours(hours, minutes, 0, 0);
      const res = await fetch(`/api/events/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, date: d.toISOString(), department, tags: tags ? tags.split(',').map(t => t.trim()) : [] }) });
      if (!res.ok) throw new Error('update failed');
      toast({ title: 'Saved', description: 'Event updated' });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Could not save event', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Department</Label>
          <Select onValueChange={setDepartment} value={department}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <Button type="submit" disabled={saving}>{saving ? <Spinner size="sm" /> : 'Save changes'}</Button>
      </form>
    </div>
  );
}
