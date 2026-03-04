'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store/useStore';

export default function HomePage() {
  const sessions = useStore((s) => s.sessions);
  const matches = useStore((s) => s.matches);
  const ranking = useStore((s) => s.ranking().slice(0, 5));

  const today = sessions[0];
  const live = matches.filter((m) => m.sessionId === today?.id && m.status === 'live');

  return (
    <main className="space-y-4">
      <h1 className="text-hero">PickleMate</h1>
      <Card>
        <p className="text-xs text-white/60">Today session</p>
        <h2 className="text-2xl font-bold">{today?.date}</h2>
        <p className="text-white/80">{today?.status.toUpperCase()} • {today?.courts} courts</p>
        <Link href={`/session/${today?.id}`} className="mt-3 inline-block text-neon underline">Manage session</Link>
      </Card>

      <Card>
        <h3 className="mb-2 text-lg font-bold">Live Courts</h3>
        <div className="grid grid-cols-2 gap-3">
          {live.map((m) => (
            <Link key={m.id} href={`/match/${m.id}`} className="rounded-xl border border-white/10 p-3">
              <p className="text-xs text-white/60">Court {m.court}</p>
              <p className="font-semibold">{m.teamA.score} - {m.teamB.score}</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-lg font-bold">Top 5 Ranking</h3>
        <ul className="space-y-1">
          {ranking.map((p, idx) => (
            <li key={p.playerId} className="flex justify-between text-sm">
              <span>{idx + 1}. {p.name}</span>
              <span className="text-neon">{p.rating}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
