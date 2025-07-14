"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-headline">Welcome to your Dashboard</h1>
      {user && <p className="mt-4">You are signed in as {user.email}</p>}
      <Button onClick={handleSignOut} className="mt-8">
        Sign Out
      </Button>
    </div>
  );
}
