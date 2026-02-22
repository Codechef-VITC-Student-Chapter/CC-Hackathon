import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import { proxy } from "@/lib/proxy";

async function GETHandler(_req: NextRequest) {
    try {
        await connectDB();

        const total_teams = await Team.countDocuments();
        const current_round_doc = await Round.findOne({ is_active: true });

        const submissions_count = await Submission.countDocuments({
            round_id: current_round_doc?._id,
        });

        const pending_evaluation_count = (await Team.countDocuments()) - (await Score.countDocuments({
            status: "scored",
            submission_id: { $in: await Submission.find({ round_id: current_round_doc?._id }).distinct("_id") }
        }));

        let round_status: any = "inactive";
        if (current_round_doc) {
            const now = new Date();
            if (current_round_doc.is_active) {
                round_status = "active";
            } else if (current_round_doc.start_time && current_round_doc.start_time > now) {
                round_status = "upcoming";
            } else {
                round_status = "completed";
            }
        }

        // Top teams logic (simplified for dashboard)
        const top_teams = await Team.find()
            .limit(5)
            .select("team_name track_id")
            .populate("track_id", "name");

        return NextResponse.json({
            total_teams,
            current_round: current_round_doc ? {
                id: current_round_doc._id,
                name: `Round ${current_round_doc.round_number}`,
                round_number: current_round_doc.round_number
            } : null,
            round_status,
            submission_enabled: current_round_doc?.submission_enabled || false,
            submissions_count,
            pending_evaluation_count: Math.max(0, pending_evaluation_count),
            top_teams: top_teams.map(t => ({
                id: (t as any)._id.toString(),
                team_name: (t as any).team_name,
                cumulative_score: 0, // Placeholder
                track: (t as any).track_id?.name || "N/A"
            }))
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const GET = proxy(GETHandler, ["admin"]);
