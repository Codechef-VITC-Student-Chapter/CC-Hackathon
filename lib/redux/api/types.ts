export type Team = {
  id: string;
  _id?: string;
  team_name: string;
  email?: string;
  track?: string | null;
  track_id?: string | null;
  score?: number | null;
  rounds_accessible?: string[];
};

export type Round = {
  _id: string;
  id?: string;
  round_number: number;
  name?: string;
  status?: "draft" | "active" | "paused" | "closed";
  is_active: boolean;
  submission_enabled: boolean;
  start_time?: string | null;
  end_time?: string | null;
  instructions?: string;
};

export type Judge = {
  id: string;
  _id?: string;
  judge_name: string;
  email: string;
  track?: string;
  track_id?: string;
  teams_count?: number;
};

export type Submission = {
  id: string;
  _id?: string;
  team_id: string;
  round_id: any;
  status?: "pending" | "scored" | "rejected";
  score?: {
    score: number;
    status: string;
    remarks: string;
    num_judges?: number;
  } | null;
  file_url?: string;
  github_link?: string;
  overview?: string;
  submitted_at?: string;
};

export type Subtask = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  track_id: string;
  is_active?: boolean;
  order?: number;
};

export type TeamDashboard = {
  team_name: string;
  track: string;
  track_id: string | null;
  current_round: Round | null;
  current_round_subtask: any | null;
  current_round_submission: any | null;
  current_round_score: any | null;
  total_score: number;
  latest_round_score: any | null;
  all_round_scores: any[];
  rounds_accessible: string[];
};

export type JudgeDashboard = {
  judge: {
    id: string;
    name: string;
    email: string;
    track: string;
    track_description: string;
  };
  teams_assigned: {
    count: number;
    teams: Array<{ id: string; name: string }>;
  };
  active_round: {
    id: string;
    round_number: number;
    is_active: boolean;
    start_time: string;
    end_time: string;
  } | null;
  statistics: {
    total_submissions: number;
    total_scores_given: number;
    pending_reviews: number;
    average_score: number;
  };
  current_round_stats: {
    round_id: string | null;
    round_number: number | null;
    submissions_in_round: number;
    scores_in_round: number;
    pending_in_round: number;
  };
};

export type AdminDashboard = {
  total_teams: number;
  current_round: {
    id: string;
    name: string;
    round_number: number;
  } | null;
  round_status:
  | "idle"
  | "active"
  | "paused"
  | "closed"
  | "inactive"
  | "upcoming"
  | "completed";
  submission_enabled: boolean;
  submissions_count: number;
  pending_evaluation_count: number;
  top_teams: Array<{
    id: string;
    team_name: string;
    cumulative_score: number;
    track: string;
  }>;
};

export type TeamDetail = {
  id: string;
  team_name: string;
  track: string | null;
  current_round_id: string | null;
  current_round_name: string | null;
  score: number | null;
  submission_status: "pending" | "submitted" | "locked" | "not_required";
  is_shortlisted?: boolean;
  is_locked?: boolean;
  is_eliminated?: boolean;
  round_scores?: Array<{
    round_id: string;
    round_number: number;
    score: number | null;
  }>;
};

export type RoundTeamSelection = {
  team_id: string;
  team_name: string;
  shown_options: { id: string; title: string }[];
  chosen_option: { id: string; title: string } | null;
  next_round_task_a?: string;
  next_round_task_b?: string;
};

export type JudgeAssignment = {
  judge_id: string;
  judge_name: string;
  judge_email: string;
  track: string;
  team_id: string;
  team_name: string;
};
