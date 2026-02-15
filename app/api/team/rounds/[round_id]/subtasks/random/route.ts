import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Subtask from "@/models/Subtask";
import TeamSubtaskDisplay from "@/models/TeamSubtaskDisplay";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ round_id: string }> }
) {
    try {
        const { round_id } = await params;
        const { teamId } = await getTeamSession();

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

        // 3. Check if we already showed subtasks to this team
        const existingDisplay = await TeamSubtaskDisplay.find({
            team_id: teamId,
            round_id: round_id
        }).populate("subtask_id");

        if (existingDisplay.length > 0) {
            return NextResponse.json({
                message: "Subtasks already assigned",
                subtasks: existingDisplay.map(d => d.subtask_id)
            });
        }

        // 4. Fetch Active Subtasks
        // We need to select 2 distinct random subtasks
        const subtasks = await Subtask.aggregate([
            { $match: { round_id: new Object(round_id), is_active: true } }, // Ensure round_id is ObjectId if needed, or string match depending on DB
            { $sample: { size: 2 } }
        ]);

        // Fallback if aggregate fails or simple find is better for small datasets
        if (subtasks.length === 0) {
            const allSubtasks = await Subtask.find({ round_id: round_id, is_active: true });
            if (allSubtasks.length === 0) {
                return NextResponse.json(
                    { error: "No active subtasks available for this round" },
                    { status: 404 }
                );
            }
            // If we have tasks but aggregate didn't work (rare), manual sample
            // This part might be redundant if aggregate works, but good safety
        }

        if (subtasks.length < 2 && subtasks.length > 0) {
            // If only 1 task exists, show it 
        }

        // 5. Save Display
        const displayRecords = await Promise.all(subtasks.map(async (task: any) => {
            return await TeamSubtaskDisplay.create({
                team_id: teamId,
                round_id: round_id,
                subtask_id: task._id
            });
        }));

        return NextResponse.json({
            message: "Subtasks assigned successfully",
            subtasks: subtasks
        });

    } catch (error: any) {
        if (error.status && error.error) {
            return NextResponse.json({ error: error.error }, { status: error.status });
        }
        console.error("GET /random error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}