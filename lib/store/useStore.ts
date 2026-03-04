'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createSeed } from '@/lib/demo/seed';
import { Club, Match, Player, RankingEntry, Session } from '@/lib/types';

type PMState = {
  club: Club;
  players: Player[];
  sessions: Session[];
  matches: Match[];
  syncedAt: number;
  toggleCheckIn: (sessionId: string, playerId: string) => void;
  addGuest: (sessionId: string) => void;
  closeSession: (sessionId: string) => void;
  startScheduledMatch: (matchId: string) => void;
  createMatch: (sessionId: string, court: number, teamA: string[], teamB: string[]) => void;
  updateScore: (matchId: string, team: 'A' | 'B') => void;
  finishMatch: (matchId: string) => void;
  resetDemo: () => void;
  exportState: () => string;
  importState: (payload: string) => { ok: boolean; message: string };
  ranking: () => RankingEntry[];
};

const seed = createSeed();
const BC_NAME = 'picklemate';

type Snapshot = Pick<PMState, 'club' | 'players' | 'sessions' | 'matches' | 'syncedAt'>;

const buildSnapshot = (s: PMState): Snapshot => ({
  club: s.club,
  players: s.players,
  sessions: s.sessions,
  matches: s.matches,
  syncedAt: Date.now(),
});

const expectedScore = (ra: number, rb: number) => 1 / (1 + 10 ** ((rb - ra) / 400));

const updateElo = (players: Player[], match: Match) => {
  const K = 24;
  const find = (id: string) => players.find((p) => p.id === id);
  const aMembers = match.teamA.playerIds.map(find).filter(Boolean) as Player[];
  const bMembers = match.teamB.playerIds.map(find).filter(Boolean) as Player[];
  if (!aMembers.length || !bMembers.length) return players;

  const ra = aMembers.reduce((acc, p) => acc + p.rating, 0) / aMembers.length;
  const rb = bMembers.reduce((acc, p) => acc + p.rating, 0) / bMembers.length;
  const ea = expectedScore(ra, rb);
  const sa = match.teamA.score > match.teamB.score ? 1 : 0;
  const deltaA = Math.round(K * (sa - ea));
  const deltaB = -deltaA;

  const idsA = new Set(aMembers.map((p) => p.id));
  const idsB = new Set(bMembers.map((p) => p.id));
  const now = new Date().toISOString();

  return players.map((p) => {
    if (idsA.has(p.id)) {
      const rating = p.rating + Math.round(deltaA / aMembers.length);
      return {
        ...p,
        rating,
        wins: p.wins + (sa === 1 ? 1 : 0),
        losses: p.losses + (sa === 0 ? 1 : 0),
        ratingHistory: [...p.ratingHistory, { date: now, rating, reason: `match ${match.id}` }],
      };
    }
    if (idsB.has(p.id)) {
      const rating = p.rating + Math.round(deltaB / bMembers.length);
      return {
        ...p,
        rating,
        wins: p.wins + (sa === 0 ? 1 : 0),
        losses: p.losses + (sa === 1 ? 1 : 0),
        ratingHistory: [...p.ratingHistory, { date: now, rating, reason: `match ${match.id}` }],
      };
    }
    return p;
  });
};

let channel: BroadcastChannel | null = null;

const publish = (get: () => PMState) => {
  if (typeof window === 'undefined') return;
  if (!channel) channel = new BroadcastChannel(BC_NAME);
  channel.postMessage({ type: 'SYNC', payload: buildSnapshot(get()) });
};

const baseState = () => {
  const s = createSeed();
  return { ...s, syncedAt: Date.now() };
};

export const useStore = create<PMState>()(
  persist(
    (set, get) => ({
      ...baseState(),
      toggleCheckIn: (sessionId, playerId) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  checkedInPlayerIds: s.checkedInPlayerIds.includes(playerId)
                    ? s.checkedInPlayerIds.filter((id) => id !== playerId)
                    : [...s.checkedInPlayerIds, playerId],
                }
              : s,
          ),
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, checkedIn: !p.checkedIn } : p,
          ),
          syncedAt: Date.now(),
        }));
        publish(get);
      },
      addGuest: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, guestCount: s.guestCount + 1 } : s,
          ),
          syncedAt: Date.now(),
        }));
        publish(get);
      },
      closeSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === sessionId ? { ...s, status: 'closed' } : s)),
          syncedAt: Date.now(),
        }));
        publish(get);
      },
      startScheduledMatch: (matchId) => {
        set((state) => {
          const target = state.matches.find((m) => m.id === matchId);
          if (!target || target.status !== 'scheduled') return state;
          const session = state.sessions.find((s) => s.id === target.sessionId);
          if (!session || session.status === 'closed') return state;
          const liveOnCourt = state.matches.some(
            (m) =>
              m.sessionId === target.sessionId &&
              m.court === target.court &&
              m.status === 'live' &&
              m.id !== target.id,
          );
          if (liveOnCourt) return state;
          return {
            matches: state.matches.map((m) => (m.id === matchId ? { ...m, status: 'live' } : m)),
            syncedAt: Date.now(),
          };
        });
        publish(get);
      },
      createMatch: (sessionId, court, teamA, teamB) => {
        set((state) => {
          const existingLive = state.matches.find(
            (m) => m.sessionId === sessionId && m.court === court && m.status === 'live',
          );
          if (existingLive) return state;
          const id = `m-${state.matches.length + 1}`;
          return {
            matches: [
              ...state.matches,
              {
                id,
                sessionId,
                court,
                status: 'scheduled',
                teamA: { playerIds: teamA, score: 0 },
                teamB: { playerIds: teamB, score: 0 },
                createdAt: new Date().toISOString(),
              },
            ],
            syncedAt: Date.now(),
          };
        });
        publish(get);
      },
      updateScore: (matchId, team) => {
        set((state) => ({
          matches: state.matches.map((m) => {
            if (m.id !== matchId || m.status !== 'live') return m;
            return team === 'A'
              ? { ...m, teamA: { ...m.teamA, score: m.teamA.score + 1 } }
              : { ...m, teamB: { ...m.teamB, score: m.teamB.score + 1 } };
          }),
          syncedAt: Date.now(),
        }));
        publish(get);
      },
      finishMatch: (matchId) => {
        set((state) => {
          const match = state.matches.find((m) => m.id === matchId);
          if (!match || match.status === 'finished') return state;
          const finishedMatch: Match = { ...match, status: 'finished', finishedAt: new Date().toISOString() };
          return {
            matches: state.matches.map((m) => (m.id === matchId ? finishedMatch : m)),
            players: updateElo(state.players, finishedMatch),
            syncedAt: Date.now(),
          };
        });
        publish(get);
      },
      resetDemo: () => {
        set(baseState());
        publish(get);
      },
      exportState: () => JSON.stringify(buildSnapshot(get()), null, 2),
      importState: (payload) => {
        try {
          const parsed = JSON.parse(payload) as Snapshot;
          if (!parsed.club || !parsed.players || !parsed.sessions || !parsed.matches) {
            return { ok: false, message: 'Invalid JSON structure.' };
          }
          set({ ...parsed, syncedAt: Date.now() });
          publish(get);
          return { ok: true, message: 'Imported successfully.' };
        } catch {
          return { ok: false, message: 'JSON parse failed.' };
        }
      },
      ranking: () =>
        [...get().players]
          .sort((a, b) => b.rating - a.rating)
          .map((p) => ({
            playerId: p.id,
            name: p.name,
            rating: p.rating,
            wins: p.wins,
            losses: p.losses,
          })),
    }),
    {
      name: 'picklemate-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => buildSnapshot(state),
      onRehydrateStorage: () => (state) => {
        if (!state || typeof window === 'undefined') return;
        if (!channel) channel = new BroadcastChannel(BC_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type !== 'SYNC') return;
          const incoming = event.data.payload as Snapshot;
          if (!incoming || incoming.syncedAt <= state.syncedAt) return;
          useStore.setState({ ...incoming });
        };
      },
    },
  ),
);
