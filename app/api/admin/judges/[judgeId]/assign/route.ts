import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/db";
import Judge from "@/models/Judge";
import { proxy } from "@/lib/proxy";

async function POSTHandler(
  request: NextRequest,
  context: { params: Promise<{ judgeId: string }> },
) {
  await connectDB();
  const { judgeId } = await context.params;

  try {
    const body = await request.json();
    const { team_ids } = body;

    if (!Array.isArray(team_ids)) {
      return NextResponse.json(
        { error: "team_ids must be an array" },
        { status: 400 },
      );
    }

    // Update judge's teams_assigned field
    await Judge.updateOne({ _id: judgeId }, { teams_assigned: team_ids });

    return NextResponse.json({
      message: `Updated team assignments for Judge ${judgeId}`,
      success: true,
      assigned_count: team_ids.length,
    });
  } catch (error) {
    console.error("Error assigning teams:", error);
    return NextResponse.json(
      { error: "Failed to assign teams" },
      { status: 500 },
    );
  }
}

export const POST = proxy(POSTHandler, ["admin"]);
