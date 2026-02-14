import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { teamId: string } },
) {
  const { teamId } = params;

  return NextResponse.json({
    message: `Team ${teamId} has been shortlisted for the next round.`,
    newStatus: "qualified",
  });
}
