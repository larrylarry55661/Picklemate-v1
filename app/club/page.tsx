'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { NeonButton } from '@/components/ui/NeonButton';
import { useStore } from '@/lib/store/useStore';

export default function ClubPage() {
  const club = useStore((s) => s.club);
  const players = useStore((s) => s.players);
  const resetDemo = useStore((s) => s.resetDemo);
  const exportState = useStore((s) => s.exportState);
  const importState = useStore((s) => s.importState);
  const [payload, setPayload] = useState('');
  const [message, setMessage] = useState('');

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Club</h1>
      <Card>
        <p className="text-2xl font-bold">{club.name}</p>
        <p className="text-white/70">{club.city} • {players.length} members</p>
      </Card>

      <Card>
        <h2 className="mb-2 font-bold">Members</h2>
        <ul className="max-h-64 space-y-1 overflow-auto text-sm">
          {players.map((p) => (
            <li key={p.id} className="flex justify-between rounded-lg border border-white/10 px-2 py-1">
              <span>{p.name}</span>
              <span className="text-neon">{p.rating}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-2">
        <h2 className="font-bold">Demo Admin</h2>
        <div className="flex flex-wrap gap-2">
          <NeonButton onClick={resetDemo}>Reset Demo</NeonButton>
          <NeonButton onClick={() => setPayload(exportState())}>Export JSON</NeonButton>
          <NeonButton
            onClick={() => {
              const result = importState(payload);
              setMessage(result.message);
            }}
          >
            Import JSON
          </NeonButton>
        </div>
        <textarea
          className="h-48 w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Export/import JSON"
        />
        {message && <p className="text-sm text-white/70">{message}</p>}
      </Card>
    </main>
  );
}
