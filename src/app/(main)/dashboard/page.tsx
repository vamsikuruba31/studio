import { getEvents } from '@/lib/firebase/firestore';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import type { CampusEvent } from '@/lib/types';
import { Suspense } from 'react';
import { Spinner } from '@/components/Spinner';

export default async function DashboardPage() {
  const events: CampusEvent[] = await getEvents();

  return (
    <div className="space-y-12">
      <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
        <DashboardClient allEvents={events} />
      </Suspense>
    </div>
  );
}
