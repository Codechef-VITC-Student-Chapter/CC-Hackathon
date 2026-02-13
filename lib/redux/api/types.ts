export type Team = {
  id: string;
  name: string;
  track?: string | null;
  currentRoundId?: string | null;
  score?: number | null;
};

export type Round = {
  id: string;
  name: string;
  status?: "draft" | "active" | "paused" | "closed";
  startsAt?: string | null;
  endsAt?: string | null;
};

export type Judge = {
  id: string;
  name: string;
  email: string;
};

export type Submission = {
  id: string;
  teamId: string;
  roundId: string;
  status?: "pending" | "scored" | "rejected";
  score?: number | null;
};
