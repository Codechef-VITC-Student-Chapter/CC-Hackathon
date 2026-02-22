import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getJudgeSession } from "@/lib/getJudgeSession";
import Judge from "@/models/Judge";
import Round from "@/models/Round";
import Team from "@/models/Team";
import Track from "@/models/Track";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import { proxy } from "@/lib/proxy";

async function GETHandler(request: NextRequest) {
  try {
    const { judgeId } = await getJudgeSession();
    await connectDB();

    const judge = await Judge.findById(judgeId).populate("track_id");
    if (!judge) {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }

    const activeRound = await Round.findOne({ is_active: true });

    // Fetch assigned teams
    const assignedTeams = await Team.find({
      _id: { $in: judge.teams_assigned }
    }).select("team_name track_id");

    // Fetch statistics
    const totalSubmissions = await Submission.countDocuments({
      round_id: activeRound?._id
    });

    const reviewsGiven = await Score.countDocuments({
      judge_id: judgeId,
      status: "scored"
    });

    return NextResponse.json({
      judge: {
        id: judge._id,
        name: judge.judge_name,
        email: judge.email, // Wait, Judge model doesn't have email. Need to check User?
        track: (judge.track_id as any)?.name || "N/A",
        track_description: (judge.track_id as any)?.description || ""
      },
      teams_assigned: {
        count: judge.teams_assigned?.length || 0,
        teams: assignedTeams.map(t => ({ id: t._id, name: t.team_name }))
      },
      active_round: activeRound ? {
        id: activeRound._id,
        round_number: activeRound.round_number,
        is_active: activeRound.is_active,
        start_time: activeRound.start_time,
        end_time: activeRound.end_time
      } : null,
      statistics: {
        total_submissions: totalSubmissions,
        total_scores_given: reviewsGiven,
        pending_reviews: (judge.teams_assigned?.length || 0) - reviewsGiven,
        average_score: 0 // Could calculate this
      }
    });
  } catch (err: any) {
    console.error("GET /api/judge dashboard error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = proxy(GETHandler, ["judge", "admin"]);
