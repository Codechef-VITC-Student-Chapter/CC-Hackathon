import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Team from "@/models/Team";
import User from "@/models/User";
import Round from "@/models/Round";
import Submission from "@/models/Submission";

export const dynamic = 'force-dynamic';

// GET: List all teams with details
export async function GET() {
  await connectDB();

  try {
    const teams = await Team.find({})
      .populate({ path: "rounds_accessible", model: Round, select: "round_number title is_active" })
      .lean();

    // Fetch active round
    const activeRound = await Round.findOne({ is_active: true }).lean();

    // Create a map of teamId -> boolean (submitted or not for active round)
    const submissionMap = new Set();
    if (activeRound) {
      try {
        const submissions = await Submission.find({ round_id: activeRound._id }, 'team_id').lean();
        submissions.forEach((s: any) => {
          if (s.team_id) submissionMap.add(s.team_id.toString());
        });
      } catch (err) {
        console.error("Error fetching submissions for active round:", err);
      }
    }

    const formattedTeams = teams.map((team) => {
      const rounds = (team.rounds_accessible || []) as any[];
      // Logic: If there is an active round, use that. Else use the last accessible one.
      const currentRound = activeRound
        ? rounds.find((r: any) => r._id.toString() === activeRound._id.toString())
        : (rounds.length > 0 ? rounds[rounds.length - 1] : null);

      const hasSubmitted = activeRound ? submissionMap.has(team._id.toString()) : false;

      let status = "pending";
      if (team.is_eliminated) status = "eliminated";
      else if (team.is_shortlisted) status = "shortlisted";
      else if (team.is_locked) status = "locked";
      else if (hasSubmitted) status = "submitted";

      return {
        id: team._id.toString(),
        name: team.team_name,
        track: team.track,
        email: team.email,
        isLocked: team.is_locked,
        isShortlisted: team.is_shortlisted,
        isEliminated: team.is_eliminated,
        currentRoundId: currentRound?._id?.toString() ?? null,
        currentRoundName: currentRound ? `Round ${currentRound.round_number}` : null,
        score: null,
        submissionStatus: status
      };
    });

    return NextResponse.json(formattedTeams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST: Add a new team (and create associated user)
export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();

    if (!body.name || !body.track || !body.email) {
      return NextResponse.json({ error: "Name, track, and email are required" }, { status: 400 });
    }

    // 0. Check for invalid or duplicate data
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser && existingUser.role !== "team") {
      return NextResponse.json({ error: "Email already registered with a different role" }, { status: 400 });
    }

    const existingTeam = await Team.findOne({ team_name: body.name });
    if (existingTeam) {
      return NextResponse.json({ error: "Team name already exists" }, { status: 400 });
    }

    // 1. Create the Team
    const newTeam = await Team.create({
      team_name: body.name,
      track: body.track,
    });

    // 2. Create or Update the User (Team Leader)
    // We upsert so if they logged in before, we just add the role and team_id
    await User.findOneAndUpdate(
      { email: body.email },
      {
        role: "team",
        team_id: newTeam._id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      message: "Team added successfully",
      team: {
        id: newTeam._id.toString(),
        name: newTeam.team_name,
        track: newTeam.track
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
