import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Subtask from "@/models/Subtask";
import mongoose from "mongoose";

// PUT: Update a subtask
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ subtaskId: string }> },
) {
  await connectDB();
  const { subtaskId } = await params;
  const body = await request.json();

  try {
    const updatedSubtask = await Subtask.findByIdAndUpdate(subtaskId, body, {
      new: true,
    });

    if (!updatedSubtask) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `Subtask ${subtaskId} updated`,
      updatedData: updatedSubtask,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}

// DELETE: Remove a subtask
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ subtaskId: string }> },
) {
  await connectDB();
  const { subtaskId } = await params;

  try {
    const deletedSubtask = await Subtask.findByIdAndDelete(subtaskId);

    if (!deletedSubtask) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }

    // Cascade Delete
    // 1. Delete Team Selections for this subtask
    await mongoose.connection.collection("teamsubtaskselections").deleteMany({ subtask_id: new mongoose.Types.ObjectId(subtaskId) });

    return NextResponse.json({
      message: `Subtask ${subtaskId} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    return NextResponse.json({ error: "Failed to delete subtask" }, { status: 500 });
  }
}
