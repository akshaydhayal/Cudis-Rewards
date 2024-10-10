import UserModel from "@/models/userModel"; // Import the User model
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB


// Define NFT award thresholds and details
// const NFT_AWARDS = [
//   { threshold: 10000, name: "10K Steps Badge", image: "/nft-images/10k-steps.png" },
//   { threshold: 50000, name: "50K Steps Badge", image: "/nft-images/50k-steps.png" },
//   { threshold: 100000, name: "100K Steps Badge", image: "/nft-images/100k-steps.png" },
//   { threshold: 1000, name: "1K Points Badge", image: "/nft-images/1k-points.png" },
//   { threshold: 5000, name: "5K Points Badge", image: "/nft-images/5k-points.png" },
//   { threshold: 10000, name: "10K Points Badge", image: "/nft-images/10k-points.png" },
// ];
const NFT_AWARDS = [
  { threshold: 1000, name: "10K Steps Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
  { threshold: 5000, name: "50K Steps Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
  { threshold: 10000, name: "100K Steps Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
  { threshold: 100, name: "1K Points Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
  { threshold: 500, name: "5K Points Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
  { threshold: 1000, name: "10K Points Badge", image: "https://png.pngtree.com/element_pic/00/16/07/18578cd65e6ecaa.jpg" },
];

export async function POST(req: NextRequest) {
  await dbConnect();

  const { walletAddress, dailyPoints, stepsWalked } = await req.json();

  if (!walletAddress || dailyPoints === undefined || stepsWalked === undefined) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    const user = await UserModel.findOne({ walletAddress });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //@ts-expect-error ignore
    const existingProgress = user.dailyProgress.find((progress) => new Date(progress.timestamp).setHours(0, 0, 0, 0) === today.getTime()
  );

    if (existingProgress) {
      return new Response(JSON.stringify({ error: "Progress entry for today already exists" }), { status: 409 });
    }

    // Add new daily progress
    user.dailyProgress.push({
      dailyPoints,
      stepsWalked,
      timestamp: new Date(),
    });

    // Update total points and steps
    user.totalPoints += dailyPoints;
  //@ts-expect-error ignore
  const totalSteps = user.dailyProgress.reduce((sum, progress) => sum + progress.stepsWalked, 0);
  
  // Check for new NFT awards
  //@ts-expect-error ignore
  const newNFTs = [];
  NFT_AWARDS.forEach((award) => {
      if (
        (award.name.includes("Steps") && totalSteps >= award.threshold) ||
        (award.name.includes("Points") && user.totalPoints >= award.threshold)
      ) {
        //@ts-expect-error ignore
        if (!user.nftsReceived.some((nft) => nft.name === award.name)) {
          newNFTs.push(award);
          user.nftsReceived.push(award);
        }
      }
    });

    await user.save();

    return new Response(
      JSON.stringify({
        message: "Daily progress added successfully",
        user,
        //@ts-expect-error ignore
        newNFTs: newNFTs.length > 0 ? newNFTs : null,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding daily progress:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}




// import UserModel from "@/models/userModel"; // Import the User model
// import { NextRequest } from "next/server";
// import dbConnect from "@/lib/dbConnect"; // Ensure you have a function to connect to your MongoDB

// export async function POST(req:NextRequest) {
//   await dbConnect(); // Connect to the database

//   const { walletAddress, dailyPoints, stepsWalked } = await req.json();

//   if (!walletAddress || dailyPoints === undefined || stepsWalked === undefined) {
//     return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
//   }

//   try {
//     // Find the user by wallet address
//     const user = await UserModel.findOne({ walletAddress });
//     if (!user) {
//       return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
//     }

//     // Check if the user already has a progress entry for today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to the start of the day

//     //@ts-expect-error ignore
//     const existingProgress = user.dailyProgress.find((progress) => new Date(progress.timestamp).setHours(0, 0, 0, 0) === today.getTime());

//     if (existingProgress) {
//       return new Response(JSON.stringify({ error: "Progress entry for today already exists" }), { status: 409 });
//     }

//     // Add new daily progress
//     user.dailyProgress.push({dailyPoints,stepsWalked,timestamp: new Date(),});

//     // Update total points
//     user.totalPoints += dailyPoints;

//     await user.save();

//     return new Response(JSON.stringify({ message: "Daily progress added successfully", user }), { status: 201 });
//   } catch (error) {
//     console.error("Error adding daily progress:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//   }
// }
