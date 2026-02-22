import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import { getJudgeSession } from "@/lib/getJudgeSession";
import Team from "@/models/Team";
import Round from "@/models/Round";
import RoundOptions from "@/models/RoundOptions";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import { scoreSchema } from "@/lib/validations";
import { proxy } from "@/lib/proxy";

async function GETHandler(
    _req: NextRequest,
    context: { params: Promise<{ round_id: string; team_id: string }> },
) {
    try {
        const { judgeId } = await getJudgeSession();
        await connectDB();

        const { round_id: paramRoundId, team_id } = await context.params;

        let round_id = paramRoundId;
        if (round_id === "active") {
            const activeRound = await Round.findOne({ is_active: true });
            if (activeRound) {
                round_id = activeRound._id.toString();
            } else {
                return NextResponse.json({ error: "No active round found" }, { status: 404 });
            }
        }

        const round = await Round.findById(round_id);
        if (!round) {
            return NextResponse.json({ error: "Round not found" }, { status: 404 });
        }

        const team = await Team.findById(team_id).populate("track_id", "name");
        if (!team) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        // Get selection and submission
        const selection = await RoundOptions.findOne({ team_id, round_id }).populate("selected");
        const submission = await Submission.findOne({ team_id, round_id }).sort({ submitted_at: -1 });

        let score = null;
        let remarks = "";
        let status = "pending";

        if (submission) {
            const scoreDoc = await Score.findOne({
                judge_id: judgeId,
                submission_id: submission._id,
            });

            if (scoreDoc) {
                score = scoreDoc.score;
                remarks = scoreDoc.remarks || "";
                status = scoreDoc.status || "pending";
            }
        }

        return NextResponse.json({
            round: {
                id: round._id.toString(),
                round_number: round.round_number,
                start_time: round.start_time,
                end_time: round.end_time,
                is_active: round.is_active,
            },
            team: {
                team_id: team._id.toString(),
                team_name: team.team_name,
                track: (team.track_id as any)?.name || "N/A",
                track_id: (team.track_id as any)?._id?.toString() || null,
            },
            selected_subtask: selection?.selected ? {
                id: (selection.selected as any)._id.toString(),
                title: (selection.selected as any).title,
                description: (selection.selected as any).description,
            } : null,
            submission: submission ? {
                id: submission._id.toString(),
                file_url: submission.file_url,
                github_link: submission.github_link,
                overview: submission.overview,
                submitted_at: submission.submitted_at,
            } : null,
            score,
            remarks,
            status,
        });
    } catch (err: any) {
        console.error("GET /api/judge/eval error:", err);
        return NextResponse.json({ error: err.error || "Internal Server Error" }, { status: err.status || 500 });
    }
}

async function POSTHandler(
    req: NextRequest,
    context: { params: Promise<{ round_id: string; team_id: string }> },
) {
    try {
        const { judgeId } = await getJudgeSession();
        await connectDB();

        const { round_id: paramRoundId, team_id } = await context.params;
        let round_id = paramRoundId;
        if (round_id === "active") {
            const activeRound = await Round.findOne({ is_active: true });
            if (activeRound) {
                round_id = activeRound._id.toString();
            } else {
                return NextResponse.json({ error: "No active round found" }, { status: 404 });
            }
        }

        const body = await req.json().catch(() => ({}));
        const validation = scoreSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { score, remarks } = validation.data;

        const submission = await Submission.findOne({ team_id, round_id }).sort({ submitted_at: -1 });
        if (!submission) {
            return NextResponse.json({ error: "No submission found for this team" }, { status: 404 });
        }

        const doc = await Score.findOneAndUpdate(
            { judge_id: judgeId, submission_id: submission._id },
            { score, remarks: remarks || "", status: "scored", updated_at: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            message: "Score saved successfully",
            data: doc
        });
    } catch (err: any) {
        console.error("POST /api/judge/eval error:", err);
        return NextResponse.json({ error: err.error || "Internal Server Error" }, { status: err.status || 500 });
    }
}

export const GET = proxy(GETHandler, ["judge", "admin"]);
export const POST = proxy(POSTHandler, ["judge", "admin"]);
export const PATCH = proxy(POSTHandler, ["judge", "admin"]); // Standardize to use POST/PATCH interchangeably for evaluation
