import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import RoundOptions from "@/models/RoundOptions";
import Round from "@/models/Round";
import { proxy } from "@/lib/proxy";

async function POSTHandler(request: NextRequest) {
    try {
        const { teamId } = await getTeamSession();
        const { roundId, subtaskId } = await request.json();

        if (!roundId || !subtaskId) {
            return NextResponse.json(
                { error: "roundId and subtaskId are required" },
                { status: 400 },
            );
        }

        await connectDB();

        const round = await Round.findById(roundId);
        if (!round) {
            return NextResponse.json({ error: "Round not found" }, { status: 404 });
        }

        if (!round.is_active) {
            return NextResponse.json({ error: "Round is not active" }, { status: 400 });
        }

        let selection = await RoundOptions.findOne({
            team_id: teamId,
            round_id: roundId,
        });

        if (!selection) {
            selection = new RoundOptions({
                team_id: teamId,
                round_id: roundId,
                options: [subtaskId],
                selected: subtaskId,
                selected_at: new Date(),
            });
        } else {
            selection.selected = subtaskId;
            selection.selected_at = new Date();
            // Ensure subtaskId is in options if options are tracked
            if (!selection.options.includes(subtaskId)) {
                selection.options.push(subtaskId);
            }
        }

        await selection.save();

        return NextResponse.json({
            success: true,
            message: "Subtask selected successfully",
            selected: subtaskId
        });
    } catch (err: any) {
        console.error("POST /api/team/selection error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export const POST = proxy(POSTHandler, ["team"]);
