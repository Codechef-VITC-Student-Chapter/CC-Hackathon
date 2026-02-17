import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";
import Team from "@/models/Team";
import Round from "@/models/Round";
import Subtask from "@/models/Subtask";
import Submission from "@/models/Submission";
import Score from "@/models/Score";
import Judge from "@/models/Judge";
import JudgeAssignment from "@/models/JudgeAssignment";
import TeamSubtaskSelection from "@/models/TeamSubtaskSelection";
import TeamSubtaskDisplay from "@/models/TeamSubtaskDisplay";

export async function POST() {
    await connectDB();

    try {
        // 1. Delete all Teams
        await Team.deleteMany({});

        // 2. Delete all Rounds (and Subtasks)
        await Round.deleteMany({});
        await Subtask.deleteMany({});

        // 3. Delete all Submissions, Selections, Displays
        await Submission.deleteMany({});
        await TeamSubtaskSelection.deleteMany({});
        await TeamSubtaskDisplay.deleteMany({});

        // 4. Delete Judges and Assignments and Scores
        await Judge.deleteMany({});
        await JudgeAssignment.deleteMany({});
        await Score.deleteMany({});

        // 5. Delete Users except Admin
        // Assuming 'admin' role. If there are multiple admins, this keeps all.
        // If we want to keep specific admin, we can query by email.
        // Safe approach: Keep all users with role 'admin'.
        await User.deleteMany({ role: { $ne: "admin" } });

        // Optional: Check if at least one admin exists? 
        const adminCount = await User.countDocuments({ role: "admin" });

        return NextResponse.json({
            message: "Data reset successful. Admins preserved.",
            adminCount,
            deleted: true
        });

    } catch (error) {
        console.error("Error resetting data:", error);
        return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
    }
}
