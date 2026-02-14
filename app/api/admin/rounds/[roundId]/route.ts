import { NextResponse } from "next/server";

// PATCH: Start, Stop, or Toggle Submission for a round
export async function PATCH(
  request: Request,
  { params }: { params: { roundId: string } },
) {
  const { roundId } = params;
  const body = await request.json(); // Expecting { action: "start" | "stop" | "toggle" }

  // Logic to handle different actions
  let message = "";
  if (body.action === "start") message = `Round ${roundId} started.`;
  else if (body.action === "stop") message = `Round ${roundId} stopped.`;
  else if (body.action === "toggle")
    message = `Submissions for Round ${roundId} toggled.`;
  else message = "Invalid action";

  return NextResponse.json({
    message: message,
    roundId: roundId,
    status: "updated",
  });
}
