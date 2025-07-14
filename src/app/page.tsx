import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline text-primary sm:text-6xl">
          CampusConnect
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Your smart campus event platform.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
