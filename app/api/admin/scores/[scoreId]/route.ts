import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/db";
import Score from "@/models/Score";
import { proxy } from "@/lib/proxy";
import { z } from "zod";

const updateScoreSchema = z.object({
  score: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// GET: Get single score with details
async function GETHandler(
  request: NextRequest,
  { params }: { params: Promise<{ scoreId: string }> },
) {
  await connectDB();
  const { scoreId } = await params;

  try {
    const score = await Score.findById(scoreId)
      .populate("submission_id", "link")
      .populate("judge_id", "name")
      .lean();

    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json(score);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch score" },
      { status: 500 },
    );
  }
}

export const GET = proxy(GETHandler, ["admin"]);

// PATCH: Update score
async function PATCHHandler(
  request: NextRequest,
  { params }: { params: Promise<{ scoreId: string }> },
) {
  await connectDB();
  const { scoreId } = await params;

  try {
    const body = await request.json();
    const validation = updateScoreSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { score, notes } = validation.data;

    const updatedScore = await Score.findByIdAndUpdate(
      scoreId,
      { score, notes },
      { new: true },
    );

    if (!updatedScore) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Score updated successfully",
      score: updatedScore,
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 },
    );
  }
}

export const PATCH = proxy(PATCHHandler, ["admin"]);

// DELETE: Remove score
async function DELETEHandler(
  request: NextRequest,
  { params }: { params: Promise<{ scoreId: string }> },
) {
  await connectDB();
  const { scoreId } = await params;

  try {
    const deletedScore = await Score.findByIdAndDelete(scoreId);

    if (!deletedScore) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Score deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting score:", error);
    return NextResponse.json(
      { error: "Failed to delete score" },
      { status: 500 },
    );
  }
}

export const DELETE = proxy(DELETEHandler, ["admin"]);
