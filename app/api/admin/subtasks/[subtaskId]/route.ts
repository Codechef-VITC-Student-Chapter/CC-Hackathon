import { NextResponse } from "next/server";

// PUT: Update a subtask
export async function PUT(
  request: Request,
  { params }: { params: { subtaskId: string } },
) {
  const { subtaskId } = params;
  const body = await request.json();

  return NextResponse.json({
    message: `Subtask ${subtaskId} updated`,
    updatedData: body,
  });
}

// DELETE: Remove a subtask
export async function DELETE(
  request: Request,
  { params }: { params: { subtaskId: string } },
) {
  const { subtaskId } = params;

  return NextResponse.json({
    message: `Subtask ${subtaskId} deleted successfully`,
  });
}
