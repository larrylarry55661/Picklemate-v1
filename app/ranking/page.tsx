'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/lib/store/useStore';

export default function RankingPage() {
  const ranking = useStore((s) => s.ranking());

  return (
    <main className="space-y-4">
      <h1 className="text-hero">Ranking</h1>
      <Card className="grid grid-cols-3 gap-2 text-center">
        {ranking.slice(0, 3).map((p, idx) => (
          <div key={p.playerId} className="rounded-xl border border-neon/30 bg-neon/10 p-3">
            <p className="text-xs text-white/70">#{idx + 1}</p>
            <p className="line-clamp-2 text-sm font-bold">{p.name}</p>
            <p className="text-neon">{p.rating}</p>
          </div>
        ))}
      </Card>
      <Card>
        <p className="mb-2 text-sm text-white/70">Filter: All-time</p>
        <ul className="space-y-2">
          {ranking.map((p, idx) => (
            <li key={p.playerId} className="flex items-center justify-between rounded-xl border border-white/10 p-2">
              <Link href={`/player/${p.playerId}`} className="font-medium">{idx + 1}. {p.name}</Link>
              <span className="text-neon">{p.rating}</span>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
