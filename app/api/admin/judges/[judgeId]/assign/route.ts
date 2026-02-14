import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { judgeId: string } },
) {
  const { judgeId } = params;
  const body = await request.json(); // Expecting { teamId: "t1" }

  return NextResponse.json({
    message: `Judge ${judgeId} assigned to Team ${body.teamId}`,
    success: true,
  });
}
