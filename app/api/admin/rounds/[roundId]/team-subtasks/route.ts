import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/db";
import RoundOptions from "@/models/RoundOptions";
import { proxy } from "@/lib/proxy";

// GET: Fetch subtask assignments for teams in a round
async function GETHandler(
    request: NextRequest,
    { params }: { params: Promise<{ roundId: string }> }
) {
    await connectDB();
    const { roundId } = await params;

    try {
        const assignments = await RoundOptions.find({ round_id: roundId })
            .select("team_id options")
            .lean();

        const formattedAssignments = assignments.map((a: any) => ({
            team_id: a.team_id.toString(),
            subtask_ids: (a.options || []).map((o: any) => o.toString()),
        }));

        return NextResponse.json({ assignments: formattedAssignments });
    } catch (error) {
        console.error("Error fetching team subtasks:", error);
        return NextResponse.json(
            { error: "Failed to fetch team subtasks" },
            { status: 500 }
        );
    }
}

// POST: Update manual subtask assignments for teams in a round
async function POSTHandler(
    request: NextRequest,
    { params }: { params: Promise<{ roundId: string }> }
) {
    await connectDB();
    const { roundId } = await params;

    try {
        const body = await request.json();
        const { assignments } = body; // Array of { teamId, subtaskIds }

        if (!Array.isArray(assignments)) {
            return NextResponse.json(
                { error: "Assignments must be an array" },
                { status: 400 }
            );
        }

        for (const assignment of assignments) {
            await RoundOptions.findOneAndUpdate(
                { team_id: assignment.team_id, round_id: roundId },
                {
                    team_id: assignment.team_id,
                    round_id: roundId,
                    options: assignment.subtask_ids,
                    // We don't reset selected if it already exists, unless explicitly requested?
                    // For now, let's keep it simple. Manual update usually implies re-assigning options.
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ message: "Team subtasks updated successfully" });
    } catch (error) {
        console.error("Error updating team subtasks:", error);
        return NextResponse.json(
            { error: "Failed to update team subtasks" },
            { status: 500 }
        );
    }
}

export const GET = proxy(GETHandler, ["admin"]);
export const POST = proxy(POSTHandler, ["admin"]);
