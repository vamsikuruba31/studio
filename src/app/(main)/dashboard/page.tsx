
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline mb-4">Welcome, {user?.email}!</h1>
      <p className="text-muted-foreground mb-8">What would you like to do today?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* We will add dashboard cards here later */}
      </div>
    </div>
  );
}
