
"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { getEvents } from "@/lib/firebase/firestore";
import type { EventData } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DepartmentData {
  name: string;
  total: number;
}

export default function SummaryPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);

  useEffect(() => {
    const fetchAndProcessEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);

        const countsByDepartment = fetchedEvents.reduce((acc, event) => {
          acc[event.department] = (acc[event.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(countsByDepartment).map(([name, total]) => ({
          name,
          total,
        }));
        setDepartmentData(chartData);

      } catch (error) {
        console.error("Error fetching or processing events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessEvents();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline mb-8">Events Summary Sheet</h1>
      
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4" />
                </CardContent>
            </Card>
        </div>
      ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{events.length}</div>
                </CardContent>
            </Card>
        </div>
      )}

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Events per Department</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                 {loading ? (
                     <div className="h-[350px] w-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                    </div>
                 ) : departmentData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={departmentData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-[350px] w-full flex items-center justify-center">
                        <p className="text-muted-foreground">No event data to display.</p>
                    </div>
                 )
                }
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

