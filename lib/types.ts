export type SessionStatus = 'open' | 'closed';
export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type Club = {
  id: string;
  name: string;
  city: string;
};

export type RatingHistoryEntry = {
  date: string;
  rating: number;
  reason: string;
};

export type Player = {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  checkedIn: boolean;
  ratingHistory: RatingHistoryEntry[];
};

export type Session = {
  id: string;
  date: string;
  status: SessionStatus;
  courts: number;
  checkedInPlayerIds: string[];
  guestCount: number;
};

export type MatchTeam = {
  playerIds: string[];
  score: number;
};

export type Match = {
  id: string;
  sessionId: string;
  court: number;
  status: MatchStatus;
  teamA: MatchTeam;
  teamB: MatchTeam;
  createdAt: string;
  finishedAt?: string;
};

export type RankingEntry = {
  playerId: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
};
