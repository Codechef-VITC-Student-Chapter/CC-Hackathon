import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();

        const users = [
            { email: "vt.gowreesh43@gmail.com", role: "admin" },
            { email: "gowreesh4343@gmail.com", role: "team" },
            { email: "gowreesh287@gmail.com", role: "judge" },
        ];

        const results = [];

        for (const u of users) {
            const user = await User.findOneAndUpdate(
                { email: u.email },
                { role: u.role },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            results.push(user);
        }

        return NextResponse.json({
            message: "Database seeded successfully",
            users: results,
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { error: "Failed to seed database" },
            { status: 500 }
        );
    }
}
