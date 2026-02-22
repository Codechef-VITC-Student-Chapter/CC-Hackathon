import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/db";
import Submission from "@/models/Submission";
import { proxy } from "@/lib/proxy";
import { z } from "zod";

const updateSubmissionSchema = z.object({
  link: z.string().url().optional(),
  track_id: z.string().min(1).optional(),
});

// GET: Get single submission with details
async function GETHandler(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  await connectDB();
  const { submissionId } = await params;

  try {
    const submission = await Submission.findById(submissionId)
      .populate("team_id", "team_name")
      .populate("round_id", "round_number")
      .populate("track_id", "name")
      .lean();

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 },
    );
  }
}

export const GET = proxy(GETHandler, ["admin"]);

// PATCH: Update submission
async function PATCHHandler(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  await connectDB();
  const { submissionId } = await params;

  try {
    const body = await request.json();
    const validation = updateSubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { link, track_id } = validation.data;

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { link, track_id },
      { new: true },
    );

    if (!updatedSubmission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Submission updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 },
    );
  }
}

export const PATCH = proxy(PATCHHandler, ["admin"]);

// DELETE: Remove submission
async function DELETEHandler(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  await connectDB();
  const { submissionId } = await params;

  try {
    const deletedSubmission = await Submission.findByIdAndDelete(submissionId);

    if (!deletedSubmission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 },
    );
  }
}

export const DELETE = proxy(DELETEHandler, ["admin"]);
