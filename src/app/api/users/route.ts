import { NextRequest, NextResponse } from 'next/server';
import UserModel from "@/models/userModel"; // Import the User model
import mongoose from 'mongoose';
import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Ensure database connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const user = await UserModel.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get dates for the last 7 days (including today)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setUTCHours(0, 0, 0, 0); // Set to UTC midnight to avoid timezone issues
      return d;
    }).reverse(); // Reverse to have the oldest date first and the most recent last

    // Helper function to get the date in YYYY-MM-DD format
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Prepare daily progress data
    const dailyProgress = last7Days.map(date => {
      const formattedDate = formatDate(date); // Format the date
      const progress = user.dailyProgress.find(
                //@ts-expect-error ignore
        p => formatDate(new Date(p.timestamp)) === formattedDate // Compare using YYYY-MM-DD format
      );
      return {
        date: formattedDate, // Use the formatted date (YYYY-MM-DD)
        stepsWalked: progress ? progress.stepsWalked : 0,
        dailyPoints: progress ? progress.dailyPoints : 0,
      };
    });

    // Calculate total steps for the last 7 days
    const totalStepsFor7Days = dailyProgress.reduce((sum, day) => sum + day.stepsWalked, 0);

    // Prepare the user progress data to send
    const userProgress = {
      name: user.name,
      totalPoints: user.totalPoints,
      totalSteps: totalStepsFor7Days, // Update total steps to reflect only the last 7 days
      dailyProgress,
      nftsReceived: user.nftsReceived,
    };

    const LeaderboardUsers = await UserModel.find({}, "name totalPoints walletAddress").sort({ points: -1 }).limit(10); // Limit to top 10 users for performance, adjust as needed
    const LeaderboardUsersData = LeaderboardUsers.map((user) => ({
      name: user.name,
      points: user.totalPoints,
      walletAddress: user.walletAddress,
    }));


    // return NextResponse.json(userProgress);
    return NextResponse.json({userProgress,LeaderboardUsersData});
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




// import { NextRequest, NextResponse } from 'next/server';
// import UserModel from "@/models/userModel"; // Import the User model
// import mongoose from 'mongoose';
// import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB


// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(request.url);
//     const walletAddress = searchParams.get('walletAddress');

//     if (!walletAddress) {
//       return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
//     }

//     // Ensure database connection
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI!);
//     }

//     const user = await UserModel.findOne({ walletAddress });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Get dates for the last 7 days
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       d.setHours(0, 0, 0, 0);
//       return d;
//     }).reverse();

//     // Prepare daily progress data
//     const dailyProgress = last7Days.map(date => {
//       const progress = user.dailyProgress.find(
//         p => p.timestamp.toDateString() === date.toDateString()
//       );
//       return {
//         date: date.toISOString().split('T')[0],
//         stepsWalked: progress ? progress.stepsWalked : 0,
//         dailyPoints: progress ? progress.dailyPoints : 0,
//       };
//     });

//     const userProgress = {
//       name: user.name,
//       totalPoints: user.totalPoints,
//       totalSteps: user.dailyProgress.reduce((sum, progress) => sum + progress.stepsWalked, 0),
//       dailyProgress,
//       nftsReceived: user.nftsReceived,
//     };

//     return NextResponse.json(userProgress);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }




// // app/api/users/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import UserModel from "@/models/userModel"; // Import the User model
// import mongoose from 'mongoose';
// import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect(); // Connect to the database

//     const { searchParams } = new URL(request.url);
//     const walletAddress = searchParams.get('walletAddress');

//     if (!walletAddress) {
//       return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
//     }

//     // Ensure database connection
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI!);
//     }

//     const user = await UserModel.findOne({ walletAddress });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // Get dates for the last 7 days
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       d.setHours(0, 0, 0, 0);
//       return d;
//     }).reverse();

//     // Prepare daily progress data
//     const dailyProgress = last7Days.map(date => {
//       const progress = user.dailyProgress.find(
//         p => p.timestamp.toDateString() === date.toDateString()
//       );
//       return {
//         date: date.toISOString().split('T')[0],
//         stepsWalked: progress ? progress.stepsWalked : 0,
//         dailyPoints: progress ? progress.dailyPoints : 0,
//         achievements: getAchievements(progress ? progress.stepsWalked : 0)
//       };
//     });

//     const userProgress = {
//       name: user.name,
//       totalPoints: user.totalPoints,
//       totalSteps: user.dailyProgress.reduce((sum, progress) => sum + progress.stepsWalked, 0),
//       dailyProgress
//     };

//     return NextResponse.json(userProgress);
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// function getAchievements(steps: number): string[] {
//   const achievements = [];
//   if (steps >= 10000) achievements.push('10k Steps');
//   if (steps >= 15000) achievements.push('15k Steps');
//   if (steps >= 20000) achievements.push('20k Steps');
//   return achievements;
// }