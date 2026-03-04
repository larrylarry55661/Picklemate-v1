'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store/useStore';

export default function PlayerPage() {
  const { uid } = useParams<{ uid: string }>();
  const player = useStore((s) => s.players.find((p) => p.id === uid));
  const matches = useStore((s) => s.matches);

  const recent = useMemo(
    () =>
      matches
        .filter((m) => [...m.teamA.playerIds, ...m.teamB.playerIds].includes(uid))
        .slice(-5)
        .reverse(),
    [matches, uid],
  );

  if (!player) return <p>Unknown player.</p>;

  return (
    <main className="space-y-4">
      <h1 className="text-hero">{player.name}</h1>
      <Card>
        <p className="text-neon text-3xl font-black">{player.rating}</p>
        <p>Wins/Losses: {player.wins}/{player.losses}</p>
      </Card>
      <Card>
        <h2 className="mb-2 font-bold">Recent Matches</h2>
        <ul className="space-y-2 text-sm">
          {recent.map((m) => (
            <li key={m.id} className="rounded-xl border border-white/10 p-2">
              {m.id} • court {m.court} • {m.teamA.score}:{m.teamB.score} • {m.status}
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
