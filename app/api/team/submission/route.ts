import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getTeamSession } from "@/lib/getTeamSession";
import Submission from "@/models/Submission";
import Round from "@/models/Round";
import Score from "@/models/Score";
import { proxy } from "@/lib/proxy";
import { submissionSchema } from "@/lib/validations";

async function GETHandler(request: NextRequest) {
  try {
    const { teamId } = await getTeamSession();
    await connectDB();

    const submissions = await Submission.find({ team_id: teamId })
      .populate("round_id", "round_number")
      .sort({ submitted_at: -1 })
      .lean();

    // Fetch scores for all these submissions
    const submissionIds = submissions.map((s: any) => s._id);
    const allScores = await Score.find({
      submission_id: { $in: submissionIds },
      status: "scored",
    }).lean();

    // Map scores to submissions
    const submissionsWithScores = submissions.map((sub: any) => {
      const subScores = allScores.filter(
        (s: any) => s.submission_id.toString() === sub._id.toString(),
      );
      const totalScore = subScores.reduce(
        (sum: number, s: any) => sum + (s.score || 0),
        0,
      );

      return {
        ...sub,
        score:
          subScores.length > 0
            ? {
              score: totalScore,
              status: "scored",
              remarks: subScores[0]?.remarks || "",
              num_judges: subScores.length,
            }
            : null,
      };
    });

    return NextResponse.json(submissionsWithScores);
  } catch (err: any) {
    console.error("GET /api/team/submission error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function POSTHandler(request: NextRequest) {
  try {
    const { teamId } = await getTeamSession();
    const body = await request.json();

    // Validate body (using camelCase for now as per current validations.ts, will update later)
    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { round_id, file_url, github_link, overview } = result.data;

    await connectDB();

    const round = await Round.findById(round_id);
    if (!round || !round.is_active) {
      return NextResponse.json({ error: "Round not found or not active" }, { status: 400 });
    }

    // Check for existing submission
    const existing = await Submission.findOne({ team_id: teamId, round_id: round_id });
    if (existing) {
      return NextResponse.json({ error: "Submission already exists for this round. Use PATCH to update." }, { status: 400 });
    }

    const submission = new Submission({
      team_id: teamId,
      round_id: round_id,
      file_url: file_url,
      github_link: github_link,
      overview: overview,
      submitted_at: new Date(),
    });

    await submission.save();

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    console.error("POST /api/team/submission error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function PATCHHandler(request: NextRequest) {
  try {
    const { teamId } = await getTeamSession();
    const body = await request.json();

    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { round_id, file_url, github_link, overview } = result.data;

    await connectDB();

    const submission = await Submission.findOne({ team_id: teamId, round_id: round_id });
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const round = await Round.findById(round_id);
    if (!round || !round.is_active) {
      return NextResponse.json({ error: "Round is closed for updates" }, { status: 400 });
    }

    submission.file_url = file_url || submission.file_url;
    submission.github_link = github_link || submission.github_link;
    submission.overview = overview || submission.overview;
    submission.submitted_at = new Date();

    await submission.save();

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    console.error("PATCH /api/team/submission error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = proxy(GETHandler, ["team"]);
export const POST = proxy(POSTHandler, ["team"]);
export const PATCH = proxy(PATCHHandler, ["team"]);
