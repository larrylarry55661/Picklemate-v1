'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store/useStore';

export default function SessionsPage() {
  const sessions = useStore((s) => s.sessions);

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Sessions</h1>
      {sessions.map((s) => (
        <Card key={s.id} className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{s.date}</p>
            <p className="text-sm text-white/70">{s.status.toUpperCase()} • {s.checkedInPlayerIds.length} checked in</p>
          </div>
          <Link href={`/session/${s.id}`} className="text-neon underline">Open</Link>
        </Card>
      ))}
    </main>
  );
}
