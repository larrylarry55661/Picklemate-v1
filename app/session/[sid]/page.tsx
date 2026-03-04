'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { NeonButton } from '@/components/ui/NeonButton';
import { useStore } from '@/lib/store/useStore';

export default function SessionDetailPage() {
  const { sid } = useParams<{ sid: string }>();
  const sessions = useStore((s) => s.sessions);
  const players = useStore((s) => s.players);
  const toggle = useStore((s) => s.toggleCheckIn);
  const addGuest = useStore((s) => s.addGuest);
  const closeSession = useStore((s) => s.closeSession);
  const matches = useStore((s) => s.matches.filter((m) => m.sessionId === sid));
  const startScheduled = useStore((s) => s.startScheduledMatch);

  const session = sessions.find((s) => s.id === sid);
  if (!session) return <p>Session not found.</p>;

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Session {session.date}</h1>
      <Card className="space-y-3">
        <p>Status: <span className="text-neon">{session.status.toUpperCase()}</span></p>
        <p>Guests: {session.guestCount}</p>
        <div className="flex gap-2">
          <NeonButton onClick={() => addGuest(session.id)}>Add Guest</NeonButton>
          <NeonButton onClick={() => closeSession(session.id)} disabled={session.status === 'closed'}>Close Session</NeonButton>
          <Link href={`/courts?sid=${session.id}`} className="rounded-2xl border border-white/20 px-4 py-2">Open Courts</Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-bold">Check-in</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {players.slice(0, 30).map((p) => {
            const checked = session.checkedInPlayerIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(session.id, p.id)}
                className={`rounded-xl border px-3 py-2 text-left text-sm ${checked ? 'border-neon bg-neon/10' : 'border-white/10'}`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 text-lg font-bold">Scheduled Matches</h2>
        <div className="space-y-2">
          {matches.filter((m) => m.status === 'scheduled').map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
              <span>Court {m.court} • {m.id}</span>
              <NeonButton onClick={() => startScheduled(m.id)}>Start</NeonButton>
            </div>
          ))}
          {matches.filter((m) => m.status === 'scheduled').length === 0 && <p className="text-sm text-white/60">No scheduled matches.</p>}
        </div>
      </Card>
    </main>
  );
}
