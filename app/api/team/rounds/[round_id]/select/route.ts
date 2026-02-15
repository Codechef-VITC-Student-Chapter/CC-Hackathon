import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Subtask from "@/models/Subtask";
import TeamSubtaskSelection from "@/models/TeamSubtaskSelection";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ round_id: string }> } // Params is a Promise in Next.js 15+
) {
    try {
        const { round_id } = await params;
        const { teamId } = await getTeamSession();
        const { subtaskId } = await request.json();

        if (!subtaskId) {
            return NextResponse.json({ error: "Subtask ID is required" }, { status: 400 });
        }

        await connectDB();

        // 1. Validate Round
        const round = await Round.findById(round_id);
        if (!round) {
            return NextResponse.json({ error: "Round not found" }, { status: 404 });
        }
        if (!round.is_active) {
            return NextResponse.json({ error: "Round is not active" }, { status: 400 });
        }

        // 2. Validate Team Access
        const team = await Team.findById(teamId);
        if (!team || !team.rounds_accessible.includes(round_id as any)) {
            return NextResponse.json({ error: "Round not accessible" }, { status: 403 });
        }

        // 3. Check existing selection
        const existingSelection = await TeamSubtaskSelection.findOne({
            team_id: teamId,
            round_id: round_id,
        });

        if (existingSelection) {
            return NextResponse.json(
                { error: "Subtask already selected", selection: existingSelection },
                { status: 400 }
            );
        }

        // 4. Validate Subtask
        const subtask = await Subtask.findById(subtaskId);
        if (!subtask) {
            return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
        }

        // 5. Validate that this subtask was actually shown to the team
        // This ensures they didn't just guess an ID

        const displayed = await import("@/models/TeamSubtaskDisplay").then(m => m.default.findOne({
            team_id: teamId,
            round_id: round_id,
            subtask_id: subtask._id
        }));

        if (!displayed) {
            return NextResponse.json({ error: "You can only select from the subtasks shown to you" }, { status: 403 });
        }
        if (subtask.round_id.toString() !== round_id) {
            return NextResponse.json({ error: "Subtask does not belong to this round" }, { status: 400 });
        }
        if (!subtask.is_active) {
            return NextResponse.json({ error: "Subtask is not active" }, { status: 400 });
        }

        // 5. Save Selection
        const newSelection = await TeamSubtaskSelection.create({
            team_id: teamId,
            round_id: round_id,
            subtask_id: subtask._id,
        });

        return NextResponse.json({
            message: "Subtask selected successfully",
            selection: newSelection,
        });

    } catch (error: any) {
        if (error.status && error.error) {
            return NextResponse.json({ error: error.error }, { status: error.status });
        }
        console.error("POST /select error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
