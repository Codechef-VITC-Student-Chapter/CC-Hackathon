import { NextResponse } from "next/server";

// GET: Fetch all subtasks for this round
export async function GET(
  request: Request,
  { params }: { params: { roundId: string } },
) {
  const { roundId } = params;

  const dummySubtasks = [
    { id: "st1", title: "Build a Login Page", roundId: roundId },
    { id: "st2", title: "Design Database Schema", roundId: roundId },
  ];

  return NextResponse.json(dummySubtasks);
}

// POST: Add a new subtask to this round
export async function POST(
  request: Request,
  { params }: { params: { roundId: string } },
) {
  const { roundId } = params;
  const body = await request.json(); // Expecting { title, description }

  return NextResponse.json(
    {
      message: "Subtask created successfully",
      subtask: { id: "st3", roundId, ...body },
    },
    { status: 201 },
  );
}
