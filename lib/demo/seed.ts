import { Club, Match, Player, Session } from '@/lib/types';

const names = [
  'Liam Carter', 'Ava Patel', 'Noah Kim', 'Emma Nguyen', 'Mason Brooks', 'Olivia Reed',
  'Ethan Flores', 'Sophia Ross', 'Lucas Price', 'Isabella Turner', 'Logan Rivera', 'Mia Cooper',
  'James Bennett', 'Amelia Ward', 'Elijah Hayes', 'Charlotte Diaz', 'Benjamin Foster', 'Harper Stone',
  'Jacob Long', 'Evelyn Gray', 'Michael James', 'Abigail Cox', 'Daniel Murphy', 'Ella Perry',
  'Henry Sanders', 'Scarlett Kelly', 'Jackson Powell', 'Grace Simmons', 'Sebastian Hughes', 'Chloe Bryant',
  'Aiden Coleman', 'Lily Henderson', 'Matthew Richardson', 'Zoey Barnes', 'Samuel Jenkins', 'Nora Coleman',
  'David Fisher', 'Riley Hamilton', 'Joseph Ellis', 'Layla Butler', 'Carter West', 'Aria Bennett',
  'Owen Russell', 'Hannah Ford', 'Wyatt Griffin', 'Aubrey Marshall', 'John Wallace', 'Addison Graham',
  'Jack Owens', 'Stella Sullivan', 'Luke Warren', 'Leah Woods', 'Julian Hunter', 'Victoria Lane',
  'Isaac Webb', 'Penelope Shaw', 'Gabriel Dean', 'Lucy Porter', 'Anthony Fields', 'Paisley Wells',
];

const toRating = (index: number) => {
  const tiers = [
    { cutoff: 8, min: 1950, max: 2100 },
    { cutoff: 24, min: 1700, max: 1940 },
    { cutoff: 42, min: 1450, max: 1690 },
    { cutoff: 60, min: 1200, max: 1440 },
  ];
  const tier = tiers.find((t) => index < t.cutoff) ?? tiers[tiers.length - 1];
  const span = tier.max - tier.min;
  return tier.max - Math.floor((index % 16) * (span / 15));
};

export const createSeed = (): { club: Club; players: Player[]; sessions: Session[]; matches: Match[] } => {
  const today = new Date();
  const isoDay = today.toISOString().slice(0, 10);

  const club: Club = {
    id: 'club-1',
    name: 'PickleMate Downtown Club',
    city: 'Austin',
  };

  const players: Player[] = names.map((name, index) => {
    const rating = toRating(index);
    return {
      id: `p-${index + 1}`,
      name,
      rating,
      wins: Math.floor((index * 3) % 28),
      losses: Math.floor((index * 5) % 20),
      checkedIn: index < 28,
      ratingHistory: [
        { date: `${isoDay}T08:00:00.000Z`, rating: rating - 12, reason: 'baseline' },
        { date: `${isoDay}T12:00:00.000Z`, rating, reason: 'demo snapshot' },
      ],
    };
  });

  const session: Session = {
    id: 's-1',
    date: isoDay,
    status: 'open',
    courts: 6,
    checkedInPlayerIds: players.slice(0, 28).map((p) => p.id),
    guestCount: 2,
  };

  const livePairs = [
    ['p-1', 'p-2', 'p-9', 'p-10', 9, 7],
    ['p-3', 'p-4', 'p-11', 'p-12', 6, 10],
    ['p-5', 'p-6', 'p-13', 'p-14', 11, 9],
    ['p-7', 'p-8', 'p-15', 'p-16', 8, 8],
    ['p-17', 'p-18', 'p-19', 'p-20', 10, 6],
    ['p-21', 'p-22', 'p-23', 'p-24', 4, 11],
  ];

  const matches: Match[] = livePairs.map((pair, idx) => ({
    id: `m-${idx + 1}`,
    sessionId: session.id,
    court: idx + 1,
    status: 'live',
    teamA: { playerIds: [pair[0] as string, pair[1] as string], score: pair[4] as number },
    teamB: { playerIds: [pair[2] as string, pair[3] as string], score: pair[5] as number },
    createdAt: `${isoDay}T18:${String(idx).padStart(2, '0')}:00.000Z`,
  }));

  return {
    club,
    players,
    sessions: [session],
    matches,
  };
};
