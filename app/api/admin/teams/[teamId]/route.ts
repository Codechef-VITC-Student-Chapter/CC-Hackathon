import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Team from "@/models/Team";
import User from "@/models/User";

// GET: Get single team
export async function GET(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    await connectDB();
    const { teamId } = await params;
    try {
        const team = await Team.findById(teamId);
        if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
        return NextResponse.json(team);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
    }
}

// PATCH: Update team fields (lock, shortlist, eliminate, etc.)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    await connectDB();
    const { teamId } = await params;
    const body = await request.json();

    console.log(`[PATCH] Updating team ${teamId} with:`, body);

    try {
        // If email is provided, update the associated User
        if (body.email) {
            // Check if email is taken by another user
            const existingUser = await User.findOne({ email: body.email });
            // If user exists and it's NOT the user belonging to this team
            if (existingUser && existingUser.team_id?.toString() !== teamId) {
                return NextResponse.json({ error: "Email already in use by another user" }, { status: 400 });
            }

            // Update user email
            await User.findOneAndUpdate(
                { team_id: teamId },
                { email: body.email }
            );
        }

        const updatedTeam = await Team.findByIdAndUpdate(teamId, body, { new: true });

        if (!updatedTeam) {
            console.log(`[PATCH] Team ${teamId} not found`);
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        console.log(`[PATCH] Team updated:`, updatedTeam);

        return NextResponse.json({
            message: "Team updated",
            team: updatedTeam
        });
    } catch (error) {
        console.error(`[PATCH] Error updating team ${teamId}:`, error);
        return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
    }
}

// DELETE: Remove team
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    await connectDB();
    const { teamId } = await params;

    try {
        const deletedTeam = await Team.findByIdAndDelete(teamId);

        if (!deletedTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Team deleted"
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
    }
}
