import type {
  AdminDashboard,
  Round,
  Subtask,
  TeamDetail,
  Judge,
  RoundTeamSelection,
} from "@/lib/redux/api/types";

export const mockDashboard: AdminDashboard = {
  total_teams: 24,
  current_round: {
    id: "r1",
    name: "Round 1",
    round_number: 1,
  },
  submissions_count: 18,
  pending_evaluation_count: 12,
  round_status: "active",
  submission_enabled: true,
  top_teams: [],
};

export const mockRounds: Round[] = [
  {
    _id: "r1",
    round_number: 1,
    name: "Round 1",
    status: "active",
    is_active: true,
    submission_enabled: true,
    start_time: "2025-02-14T10:00:00Z",
    end_time: "2025-02-14T18:00:00Z",
  },
  {
    _id: "r2",
    round_number: 2,
    name: "Round 2",
    status: "draft",
    is_active: false,
    submission_enabled: false,
    start_time: null,
    end_time: null,
  },
  {
    _id: "r3",
    round_number: 3,
    name: "Final Round",
    status: "draft",
    is_active: false,
    submission_enabled: false,
    start_time: null,
    end_time: null,
  },
];

export const mockSubtasksByRound: Record<string, Subtask[]> = {
  r1: [
    { id: "s1", title: "Subtask A", description: "Implement API for user auth", track_id: "track1", is_active: true },
    { id: "s2", title: "Subtask B", description: "Build dashboard UI", track_id: "track1", is_active: true },
    { id: "s3", title: "Subtask C", description: "Database schema design", track_id: "track1", is_active: true },
  ],
  r2: [
    { id: "s4", title: "Task 1", description: "Advanced feature set", track_id: "track2", is_active: true },
    { id: "s5", title: "Task 2", description: "Integration layer", track_id: "track2", is_active: true },
  ],
  r3: [],
};

export const mockTeams: TeamDetail[] = [
  { id: "t1", team_name: "Team Alpha", track: "AI", current_round_id: "r1", current_round_name: "Round 1", score: 72, submission_status: "submitted", is_shortlisted: false, is_locked: false },
  { id: "t2", team_name: "Team Beta", track: "Web", current_round_id: "r1", current_round_name: "Round 1", score: 85, submission_status: "submitted", is_shortlisted: true, is_locked: false },
  { id: "t3", team_name: "Team Gamma", track: "AI", current_round_id: "r1", current_round_name: "Round 1", score: null, submission_status: "pending", is_shortlisted: false, is_locked: false },
  { id: "t4", team_name: "Team Delta", track: "Mobile", current_round_id: "r1", current_round_name: "Round 1", score: 68, submission_status: "locked", is_shortlisted: false, is_locked: true },
];

export const mockRoundTeamSelections: Record<string, RoundTeamSelection[]> = {
  r1: [
    {
      team_id: "t1",
      team_name: "Team Alpha",
      shown_options: [
        { id: "s1", title: "Subtask A" },
        { id: "s2", title: "Subtask B" },
      ],
      chosen_option: { id: "s2", title: "Subtask B" },
      next_round_task_a: "s4",
      next_round_task_b: "s5",
    },
    {
      team_id: "t2",
      team_name: "Team Beta",
      shown_options: [
        { id: "s1", title: "Subtask A" },
        { id: "s3", title: "Subtask C" },
      ],
      chosen_option: { id: "s1", title: "Subtask A" },
    },
  ],
  r2: [],
  r3: [],
};

export const mockJudges: Judge[] = [
  { id: "j1", judge_name: "Alex Kim", email: "alex@example.com", teams_count: 3 },
  { id: "j2", judge_name: "Sam Wilson", email: "sam@example.com", teams_count: 2 },
  { id: "j3", judge_name: "Jordan Lee", email: "jordan@example.com", teams_count: 0 },
];
