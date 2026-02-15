import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Submission from "@/models/Submission";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ round_id: string }> }
) {
    try {
        const { round_id } = await params;
        const { teamId } = await getTeamSession();
        const { fileUrl, githubLink } = await request.json();

        if (!fileUrl && !githubLink) {
            return NextResponse.json({ error: "File URL or GitHub link is required" }, { status: 400 });
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
        if (!round.submission_enabled) {
            return NextResponse.json({ error: "Submissions are closed for this round" }, { status: 400 });
        }

        if (round.end_time && new Date() > new Date(round.end_time)) {
            return NextResponse.json({ error: "Round has ended" }, { status: 400 });
        }

        // 2. Validate Team Access
        const team = await Team.findById(teamId);
        if (!team || !team.rounds_accessible.includes(round_id as any)) {
            return NextResponse.json({ error: "Round not accessible" }, { status: 403 });
        }

        // 3. Create or Update Submission
        const submission = await Submission.findOneAndUpdate(
            { team_id: teamId, round_id: round_id },
            {
                file_url: fileUrl,
                github_link: githubLink,
                submitted_at: new Date(),
                is_locked: false // Allow updates until locked explicitly or round ends
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({
            message: "Project submitted successfully",
            submission,
        });

    } catch (error: any) {
        if (error.status && error.error) {
            return NextResponse.json({ error: error.error }, { status: error.status });
        }
        console.error("POST /submit error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}