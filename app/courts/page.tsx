'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { NeonButton } from '@/components/ui/NeonButton';
import { useStore } from '@/lib/store/useStore';

export default function CourtsPage() {
  const params = useSearchParams();
  const sid = params.get('sid') ?? 's-1';
  const players = useStore((s) => s.players);
  const sessions = useStore((s) => s.sessions);
  const matches = useStore((s) => s.matches.filter((m) => m.sessionId === sid));
  const createMatch = useStore((s) => s.createMatch);

  const session = sessions.find((s) => s.id === sid);
  const checkedPlayers = players.filter((p) => session?.checkedInPlayerIds.includes(p.id)).slice(0, 20);

  if (!session) return <p>No session.</p>;

  const createOnCourt = (court: number) => {
    const start = ((court - 1) * 4) % Math.max(checkedPlayers.length, 4);
    const four = [0, 1, 2, 3].map((i) => checkedPlayers[(start + i) % checkedPlayers.length]?.id).filter(Boolean) as string[];
    if (four.length < 4) return;
    createMatch(sid, court, [four[0], four[1]], [four[2], four[3]]);
  };

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Courts</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: session.courts }).map((_, idx) => {
          const court = idx + 1;
          const live = matches.find((m) => m.court === court && m.status === 'live');
          const scheduled = matches.find((m) => m.court === court && m.status === 'scheduled');
          return (
            <Card key={court}>
              <p className="text-xs text-white/60">Court {court}</p>
              {live && (
                <>
                  <p className="text-lg font-bold">LIVE {live.teamA.score} - {live.teamB.score}</p>
                  <Link href={`/match/${live.id}`} className="text-neon underline">Open Match</Link>
                </>
              )}
              {!live && scheduled && (
                <>
                  <p className="font-semibold">Scheduled</p>
                  <Link href={`/session/${sid}`} className="text-neon underline">Start from session</Link>
                </>
              )}
              {!live && !scheduled && <NeonButton onClick={() => createOnCourt(court)}>Create Match</NeonButton>}
            </Card>
          );
        })}
      </div>
    </main>
  );
}
