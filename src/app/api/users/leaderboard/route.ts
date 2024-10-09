// app/api/users/leaderboard/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB
import UserModel from "@/models/userModel"; // Import the User model

export async function GET() {
  try {
    await dbConnect();

    const users = await UserModel.find({}, "name totalPoints walletAddress").sort({ points: -1 }).limit(10); // Limit to top 10 users for performance, adjust as needed

    const leaderboardData = users.map((user) => ({
      name: user.name,
      points: user.totalPoints,
      walletAddress: user.walletAddress,
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard data" }, { status: 500 });
  }
}
