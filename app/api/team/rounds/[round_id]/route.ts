import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Subtask from "@/models/Subtask";
import TeamSubtaskSelection from "@/models/TeamSubtaskSelection";
import Submission from "@/models/Submission";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ round_id: string }> }
) {
    try {
        const { round_id } = await params;
        const { teamId } = await getTeamSession();

        await connectDB();

        // 1. Validate Access
        const team = await Team.findById(teamId);
        if (!team || !team.rounds_accessible.includes(round_id as any)) {
            return NextResponse.json({ error: "Round not accessible" }, { status: 403 });
        }

        // 2. Fetch Round Details
        const round = await Round.findById(round_id);
        if (!round) {
            return NextResponse.json({ error: "Round not found" }, { status: 404 });
        }

        // 3. Fetch Subtasks
        const subtasks = await Subtask.find({ round_id: round_id, is_active: true });

        // 4. Fetch Current Selection
        const selection = await TeamSubtaskSelection.findOne({
            team_id: teamId,
            round_id: round_id,
        });

        // 5. Fetch Current Submission
        const submission = await Submission.findOne({
            team_id: teamId,
            round_id: round_id,
        });

        return NextResponse.json({
            round: {
                _id: round._id,
                round_number: round.round_number,
                start_time: round.start_time,
                end_time: round.end_time,
                is_active: round.is_active,
                submission_enabled: round.submission_enabled,
            },
            subtasks,
            selection,
            submission,
        });

    } catch (error: any) {
        if (error.status && error.error) {
            return NextResponse.json({ error: error.error }, { status: error.status });
        }
        console.error("GET /rounds/[id] error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
