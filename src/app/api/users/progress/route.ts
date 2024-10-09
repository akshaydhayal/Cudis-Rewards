import UserModel from "@/models/userModel"; // Import the User model
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
  const { walletAddress, dailyPoints, stepsWalked } = await req.json();

  if (!walletAddress || dailyPoints === undefined || stepsWalked === undefined) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    // Find the user by wallet address
    const user = await UserModel.findOne({ walletAddress });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if the user already has a progress entry for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    //@ts-expect-error ignore
    const existingProgress = user.dailyProgress.find((progress) => new Date(progress.timestamp).setHours(0, 0, 0, 0) === today.getTime());

    if (existingProgress) {
      return new Response(JSON.stringify({ error: "Progress entry for today already exists" }), { status: 409 });
    }

    // Add new daily progress
    user.dailyProgress.push({dailyPoints,stepsWalked,timestamp: new Date(),});

    // Update total points
    user.totalPoints += dailyPoints;

    await user.save();

    return new Response(JSON.stringify({ message: "Daily progress added successfully", user }), { status: 201 });
  } catch (error) {
    console.error("Error adding daily progress:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
