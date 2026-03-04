'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { NeonButton } from '@/components/ui/NeonButton';
import { useStore } from '@/lib/store/useStore';

export default function MatchPage() {
  const { mid } = useParams<{ mid: string }>();
  const matches = useStore((s) => s.matches);
  const players = useStore((s) => s.players);
  const updateScore = useStore((s) => s.updateScore);
  const finish = useStore((s) => s.finishMatch);

  const match = matches.find((m) => m.id === mid);
  if (!match) return <p>Match not found.</p>;

  const getNames = (ids: string[]) => ids.map((id) => players.find((p) => p.id === id)?.name ?? id).join(' / ');
  const locked = match.status === 'finished';

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Match {match.id}</h1>
      <Card className="space-y-4 text-center">
        <p className="text-sm text-white/60">Court {match.court} • {match.status.toUpperCase()}</p>
        <p className="text-xl font-semibold">{getNames(match.teamA.playerIds)}</p>
        <p className="text-5xl font-black">{match.teamA.score} : {match.teamB.score}</p>
        <p className="text-xl font-semibold">{getNames(match.teamB.playerIds)}</p>
        <div className="flex justify-center gap-2">
          <NeonButton onClick={() => updateScore(match.id, 'A')} disabled={locked || match.status !== 'live'}>+A</NeonButton>
          <NeonButton onClick={() => updateScore(match.id, 'B')} disabled={locked || match.status !== 'live'}>+B</NeonButton>
          <NeonButton onClick={() => finish(match.id)} disabled={locked}>Finish</NeonButton>
        </div>
      </Card>
    </main>
  );
}
