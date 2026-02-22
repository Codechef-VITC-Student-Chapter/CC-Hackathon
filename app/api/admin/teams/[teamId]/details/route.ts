import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/db";
import Team from "@/models/Team";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import Round from "@/models/Round";
import Track from "@/models/Track";
import { proxy } from "@/lib/proxy";

// GET: Fetch comprehensive team details including round history and submissions
async function GETHandler(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    await connectDB();
    const { teamId } = await params;

    try {
        // 1. Fetch Basic Team Info & Track
        const team = await Team.findById(teamId).populate("track_id").lean();
        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        // 2. Fetch Submissions for this Team
        const submissions = await Submission.find({ team_id: teamId })
            .sort({ submitted_at: -1 })
            .lean();

        // 3. Fetch Scores for all Submissions
        const submissionIds = submissions.map((s: any) => s._id);
        const scores = await Score.find({ submission_id: { $in: submissionIds } }).lean();
        const scoreMap = new Map(scores.map((s: any) => [s.submission_id.toString(), s]));

        // 4. Fetch Round Details for Context
        const roundIds = [...new Set(submissions.map((s: any) => s.round_id.toString()))];
        const rounds = await Round.find({ _id: { $in: roundIds } }).lean();
        const roundMap = new Map(rounds.map((r: any) => [r._id.toString(), r]));

        // 5. Format History
        const history = submissions.map((sub: any) => {
            const score = scoreMap.get(sub._id.toString());
            const round = roundMap.get(sub.round_id.toString());
            return {
                id: sub._id.toString(),
                round_id: sub.round_id.toString(),
                round_number: round?.round_number || "Deleted",
                github_link: sub.github_link,
                file_url: sub.file_url,
                overview: sub.overview,
                submitted_at: sub.submitted_at,
                score: score?.score ?? null,
                remarks: score?.remarks || "",
                judged: !!score,
            };
        });

        // 6. Final Data Object
        const teamDetails = {
            id: team._id.toString(),
            team_name: team.team_name,
            email: team.email,
            track: (team.track_id as any)?.name || "N/A",
            track_id: (team.track_id as any)?._id?.toString(),
            total_score: history.reduce((acc, curr) => acc + (curr.score || 0), 0),
            history: history,
            rounds_accessible: (team.rounds_accessible || []).map((r: any) => r.toString()),
        };

        return NextResponse.json(teamDetails);
    } catch (error) {
        console.error("Error fetching team details:", error);
        return NextResponse.json(
            { error: "Failed to fetch team details" },
            { status: 500 }
        );
    }
}

export const GET = proxy(GETHandler, ["admin"]);
