import { baseApi } from "./baseApi";
import { Round, Team, AdminDashboard, TeamDetail, Subtask, Judge } from "./types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboard, void>({
      query: () => "/admin/dashboard",
      providesTags: ["AdminDashboard"],
    }),
    getAdminRounds: builder.query<Round[], void>({
      query: () => "/admin/rounds",
      providesTags: ["Round"],
    }),
    createRound: builder.mutation<Round, Partial<Round>>({
      query: (body) => ({
        url: "/admin/rounds",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Round", "AdminDashboard"],
    }),
    getRoundDetails: builder.query<Round, string>({
      query: (id) => `/admin/rounds/${id}`,
      providesTags: (result, error, id) => [{ type: "Round", id }],
    }),
    updateRound: builder.mutation<Round, { id: string; body: Partial<Round> }>({
      query: ({ id, body }) => ({
        url: `/admin/rounds/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Round", id },
        "Round",
        "AdminDashboard",
      ],
    }),
    deleteRound: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/rounds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Round", "AdminDashboard"],
    }),
    getRoundTeams: builder.query<
      { teams: any[]; allowedTeamIds: string[] },
      string
    >({
      query: (roundId) => `/admin/rounds/${roundId}/teams`,
      providesTags: (result, error, roundId) => [
        { type: "Round", id: roundId },
      ],
    }),
    updateRoundTeams: builder.mutation<
      { message: string; allowedTeamIds: string[] },
      { roundId: string; teamIds: string[] }
    >({
      query: ({ roundId, teamIds }) => ({
        url: `/admin/rounds/${roundId}/teams`,
        method: "POST",
        body: { teamIds },
      }),
      invalidatesTags: (result, error, { roundId }) => [
        { type: "Round", id: roundId },
      ],
    }),
    getRoundSubtasks: builder.query<Subtask[], string>({
      query: (roundId) => `/admin/rounds/${roundId}/subtasks`,
      providesTags: (result, error, roundId) => [
        { type: "Subtask", id: `round_${roundId}` },
      ],
    }),
    getAdminTeams: builder.query<TeamDetail[], void>({
      query: () => "/admin/teams",
      providesTags: ["Team"],
    }),
    createTeam: builder.mutation<Team, Partial<Team>>({
      query: (body) => ({
        url: "/admin/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team", "AdminDashboard"],
    }),
    batchCreateTeams: builder.mutation<
      any,
      { teams: Array<{ team_name: string; email: string; track_id: string }> }
    >({
      query: (body) => ({
        url: "/admin/teams/batch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team", "AdminDashboard"],
    }),
    updateTeamStatus: builder.mutation<Team, { id: string; updates: any }>({
      query: ({ id, updates }) => ({
        url: `/admin/teams/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Team", id },
        "Team",
        "AdminDashboard",
      ],
    }),
    bulkUpdateTeams: builder.mutation<any, { updates: Array<{ teamId: string; updates: any }> }>({
      query: (body) => ({
        url: "/admin/teams/bulk",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Team", "AdminDashboard"],
    }),
    getTeamDetails: builder.query<any, string>({
      // Using any for now as details structure is complex
      query: (id) => `/admin/teams/${id}/details`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),
    getAllSubtasks: builder.query<Subtask[], void>({
      query: () => "/admin/subtasks",
      providesTags: ["Subtask"],
    }),
    createSubtask: builder.mutation<
      Subtask,
      { round_id: string; title: string; description?: string; track?: string }
    >({
      query: (body) => ({
        url: "/admin/subtasks",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { round_id }) => [
        { type: "Subtask", id: `round_${round_id}` },
        "Subtask",
      ],
    }),
    updateSubtask: builder.mutation<Subtask, { id: string; body: Partial<Subtask> }>({
      query: ({ id, body }) => ({
        url: `/admin/subtasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id, body }) => [
        { type: "Subtask", id },
        "Subtask",
      ],
    }),
    deleteSubtask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/subtasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subtask", "Round"],
    }),
    getJudges: builder.query<Judge[], void>({
      query: () => "/admin/judges",
      providesTags: ["Judge"],
    }),
    getJudgeDetails: builder.query<Judge, string>({
      query: (id) => `/admin/judges/${id}`,
      providesTags: (result, error, id) => [{ type: "Judge", id }],
    }),
    createJudge: builder.mutation<Judge, Partial<Judge>>({
      query: (body) => ({
        url: "/admin/judges",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Judge", "AdminDashboard"],
    }),
    deleteJudge: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/judges/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Judge", "JudgeAssignment", "AdminDashboard"],
    }),
    updateJudge: builder.mutation<Judge, { id: string; body: Partial<Judge> }>({
      query: ({ id, body }) => ({
        url: `/admin/judges/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Judge", id },
        "Judge",
      ],
    }),
    assignTeamsToJudge: builder.mutation<any, { judgeId: string; teamIds: string[]; roundId?: string }>({
      query: ({ judgeId, teamIds, roundId }) => ({
        url: `/admin/judges/${judgeId}/assign`,
        method: "POST",
        body: { teamIds, roundId },
      }),
      invalidatesTags: ["Judge", "JudgeAssignment"],
    }),
    getJudgeAssignmentsForRound: builder.query<any, string>({
      query: (roundId) => `/admin/judges/assignments?round_id=${roundId}`,
      providesTags: (result, error, roundId) => [
        { type: "JudgeAssignment", id: `round_${roundId}` },
      ],
    }),
    createJudgeAssignment: builder.mutation<any, { judgeId: string; teamIds: string[]; roundId: string }>({
      query: ({ judgeId, teamIds, roundId }) => ({
        url: "/admin/judges/assignments",
        method: "POST",
        body: { judgeId, teamIds, roundId },
      }),
      invalidatesTags: ["JudgeAssignment"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminRoundsQuery,
  useCreateRoundMutation,
  useGetRoundDetailsQuery,
  useUpdateRoundMutation,
  useDeleteRoundMutation,
  useGetRoundTeamsQuery,
  useUpdateRoundTeamsMutation,
  useGetRoundSubtasksQuery,
  useGetAdminTeamsQuery,
  useCreateTeamMutation,
  useBatchCreateTeamsMutation,
  useUpdateTeamStatusMutation,
  useGetTeamDetailsQuery,
  useGetAllSubtasksQuery,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useGetJudgesQuery,
  useGetJudgeDetailsQuery,
  useCreateJudgeMutation,
  useDeleteJudgeMutation,
  useUpdateJudgeMutation,
  useAssignTeamsToJudgeMutation,
  useGetJudgeAssignmentsForRoundQuery,
  useCreateJudgeAssignmentMutation,
  useBulkUpdateTeamsMutation,
} = adminApi;
