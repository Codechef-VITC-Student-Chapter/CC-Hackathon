import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Team from "@/models/Team";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    await connectDB();
    try {
        const teams = await request.json(); // Expecting array of { name, track, email }

        if (!Array.isArray(teams)) {
            return NextResponse.json({ error: "Expected an array of teams" }, { status: 400 });
        }

        const results = [];
        const errors = [];

        for (const t of teams) {
            try {
                if (!t.name || !t.email) {
                    errors.push({ team: t, error: "Missing name or email" });
                    continue;
                }

                // Check 1: Team Name
                const existingTeam = await Team.findOne({ team_name: t.name });
                if (existingTeam) {
                    errors.push({ team: t, error: `Team name '${t.name}' already exists` });
                    continue;
                }

                // Check 2: User Email
                const existingUser = await User.findOne({ email: t.email });
                if (existingUser) {
                    if (existingUser.role !== 'team' && existingUser.role !== 'admin') { // Admin can be a team leader for testing? No, better strict.
                        errors.push({ team: t, error: `Email '${t.email}' is registered as ${existingUser.role}` });
                        continue;
                    }
                    if (existingUser.team_id) {
                        errors.push({ team: t, error: `User '${t.email}' already belongs to a team` });
                        continue;
                    }
                }

                // Create Team
                const newTeam = await Team.create({
                    team_name: t.name,
                    track: t.track || "General",
                });

                // Create/Update User
                await User.findOneAndUpdate(
                    { email: t.email },
                    {
                        role: "team",
                        team_id: newTeam._id
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );

                results.push({ name: newTeam.team_name, status: "created" });

            } catch (err: any) {
                errors.push({ team: t, error: err.message });
            }
        }

        return NextResponse.json({
            message: `Processed ${teams.length} teams`,
            successCount: results.length,
            errorCount: errors.length,
            errors
        }, { status: 201 });

    } catch (error) {
        console.error("Error bulk uploading teams:", error);
        return NextResponse.json(
            { error: "Failed to upload teams" },
            { status: 500 }
        );
    }
}
