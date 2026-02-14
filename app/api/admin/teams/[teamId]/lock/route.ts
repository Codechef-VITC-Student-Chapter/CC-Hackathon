import { NextResponse } from "next/server";

// PATCH: Lock the team's selection
export async function PATCH(
  request: Request,
  { params }: { params: { teamId: string } },
) {
  const { teamId } = params;

  return NextResponse.json({
    message: `Team ${teamId} selection has been LOCKED.`,
    isLocked: true,
    timestamp: new Date().toISOString(),
  });
}
