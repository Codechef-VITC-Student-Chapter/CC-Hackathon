import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { getJudgeSession } from "@/lib/getJudgeSession";
import Judge from "@/models/Judge";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import { proxy } from "@/lib/proxy";

async function GETHandler(request: NextRequest) {
    try {
        const { judgeId } = await getJudgeSession();
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        let round_id = searchParams.get("round_id");

        if (!round_id || round_id === "active") {
            const activeRound = await Round.findOne({ is_active: true });
            if (activeRound) {
                round_id = activeRound._id.toString();
            } else if (round_id === "active") {
                return NextResponse.json({ error: "No active round found" }, { status: 404 });
            }
        }

        const judge = await Judge.findById(judgeId);
        if (!judge) {
            return NextResponse.json({ error: "Judge profile not found" }, { status: 404 });
        }

        // Fetch assigned teams
        const teams = await Team.find({
            _id: { $in: judge.teams_assigned }
        }).select("team_name track_id").populate("track_id", "name");

        // Enhance with submission and score status
        const enhancedTeams = await Promise.all(teams.map(async (team) => {
            const submission = await Submission.findOne({
                team_id: team._id,
                round_id: round_id
            }).select("_id status submitted_at");

            let scoreStatus = "not_submitted";
            let score = null;

            if (submission) {
                const scoreDoc = await Score.findOne({
                    judge_id: judgeId,
                    submission_id: submission._id
                });
                scoreStatus = scoreDoc ? "scored" : "pending_review";
                score = scoreDoc?.score || null;
            }

            return {
                team_id: team._id.toString(),
                team_name: team.team_name,
                track: (team.track_id as any)?.name || "N/A",
                submission_status: submission ? "submitted" : "pending",
                submitted_at: submission?.submitted_at || null,
                status: scoreStatus === "scored" ? "scored" : "pending",
                score
            };
        }));

        return NextResponse.json(enhancedTeams);
    } catch (err: any) {
        console.error("GET /api/judge/assigned-teams error:", err);
        return NextResponse.json({ error: err.error || "Internal Server Error" }, { status: err.status || 500 });
    }
}

export const GET = proxy(GETHandler, ["judge", "admin"]);
