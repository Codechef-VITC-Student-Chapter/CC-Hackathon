import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Judge from "@/models/Judge";

// GET: Fetch judge assignments, optionally filtered by round
export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const round_id = searchParams.get("round_id");

  try {
    // Fetch all judges with their assigned teams
    const judges = await Judge.find()
      .populate("user_id", "email")
      .populate("teams_assigned", "team_name")
      .populate("track_id", "name")
      .lean();

    // Mapping to snake_case format as expected by frontend
    const assignmentData = judges.flatMap((judge: any) => {
      return (judge.teams_assigned || []).map((team: any) => ({
        judge_id: judge._id.toString(),
        judge_name: judge.judge_name,
        judge_email: judge.user_id?.email,
        track: judge.track_id?.name,
        team_id: team._id.toString(),
        team_name: team.team_name,
      }));
    });

    // If a round_id is provided, we might want to filter? 
    // Currently, judge assignments are global (all rounds). 
    // However, the frontend passes round_id. 
    // If assignments were round-specific, we'd filter here.
    // For now, we return global assignments which is the current system design.

    const assignedTeamIds = [...new Set(assignmentData.map((a) => a.team_id))];

    const formattedJudges = judges.map((j: any) => ({
      id: j._id.toString(),
      judge_name: j.judge_name,
      email: j.user_id?.email,
      track: j.track_id?.name,
      track_id: j.track_id?._id?.toString(),
      teams_count: (j.teams_assigned || []).length,
    }));

    return NextResponse.json({
      assignments: assignmentData,
      assigned_team_ids: assignedTeamIds,
      judges: formattedJudges,
    });
  } catch (error) {
    console.error("Error fetching judge assignments:", error);
    return NextResponse.json(
      { error: "Failed to fetch judge assignments" },
      { status: 500 },
    );
  }
}
