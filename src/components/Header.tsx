
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, LogOut, PlusCircle, PieChart } from "lucide-react";

export function Header() {
  const { user, userData, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
                CampusConnect
            </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 text-sm font-medium">
             {userData?.isAdmin && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/add-event">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/summary">
                    <PieChart className="mr-2 h-4 w-4" />
                    Summary
                  </Link>
                </Button>
              </>
            )}
          </nav>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* No photo field in the local user object; use empty src so AvatarFallback shows initials */}
                    <AvatarImage src={""} alt={user.email ?? ""} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
