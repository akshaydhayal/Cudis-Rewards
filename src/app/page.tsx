"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Trophy, Footprints, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userCount, userState } from "@/store/userState";
import { createAsset } from "@/lib/createAsset";
import { useWallet } from "@solana/wallet-adapter-react";
import NftModal from "@/components/NFTDisplayModal";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stepsWalked, setStepsWalked] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const userInfo = useRecoilValue(userState);
  const usersCount = useRecoilValue(userCount);
  const [nftMintStatus, setNftMintStatus] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [nftType,setNftType]=useState<null | string>(null);


  console.log("userInfo: ",userInfo);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const leaderboardRes = await fetch("/api/users/leaderboard");
        const leaderboardData = await leaderboardRes.json();

        // Sort leaderboard data by points in descending order
        //@ts-expect-error  ignore
        const sortedLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);
        setLeaderboard(sortedLeaderboard);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [usersCount]);

  //@ts-expect-error  ignore
  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    //@ts-expect-error  ignore
    if (!userInfo.walletAddress) {
      alert("Connect your Wallet first to record Daily Progress");
      return;
    }
    try {
      const response = await fetch("/api/users/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //@ts-expect-error  ignore
          walletAddress: userInfo.walletAddress,
          stepsWalked: parseInt(stepsWalked),
          dailyPoints: Math.floor(parseInt(stepsWalked) / 10), // 1 point per 10 steps, rounded down
        }),
      });
      if (response.ok) {
        alert("Progress updated successfully!");
        setShowMint(true);
        setStepsWalked("");
        const steps=parseInt(stepsWalked);
        
        if(steps<=1000){
          setNftType("beginner");
        }else if(steps<=5000){
          setNftType("intermediate")
        }else{
          setNftType("expert")
        }
        // Refresh leaderboard
        const leaderboardRes = await fetch("/api/users/leaderboard");
        const leaderboardData = await leaderboardRes.json();
        //@ts-expect-error  ignore
        const sortedLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);
        setLeaderboard(sortedLeaderboard);
      } else {
        console.log('r',response);
        if(response.status==409){
          alert("Record already entered for the day. Come Tomorrow!!");
          return;
        }
        alert("Failed to update progress. Please try again.");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  //@ts-expect-error  ignore
  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-gray-300";
      case 2:
        return "text-yellow-700";
      default:
        return "text-blue-400";
    }
  };

  //@ts-expect-error  ignore
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Medal className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 2:
        return <Medal className="w-6 h-6 text-yellow-700" />;
      default:
        return null;
    }
  };

    const wallet = useWallet();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-400 flex items-center">
              <Footprints className="mr-2" /> Daily Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProgressSubmit} className="space-y-4">
              <div>
                <label htmlFor="steps" className="block text-sm font-medium text-gray-300 mb-1">
                  Steps walked today
                </label>
                <Input
                  id="steps"
                  type="number"
                  value={stepsWalked}
                  onChange={(e) => setStepsWalked(e.target.value)}
                  placeholder="Enter steps walked"
                  className="bg-gray-700 text-gray-100 border-gray-600"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Update Progress
              </Button>
            </form>
              {showMint && <Button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 
        px-4 rounded"
                onClick={() => {
                  createAsset(wallet, nftType,setNftMintStatus,setShowMint);
                  // createAsset(wallet, 'beginner', setNftMintStatus);
                }}
              >
                Mint your NFT badge!!
              </Button>}
              {nftMintStatus && <Button disabled
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 
        px-4 rounded" 
                onClick={() => {
                  createAsset(wallet, nftType,setNftMintStatus,setShowMint);
                  // createAsset(wallet, 'beginner', setNftMintStatus);
                }}
              >
                Minted Daily Progress NFT!!
              </Button>}
          </CardContent>
        </Card>
        {nftMintStatus && <NftModal trackName={nftType} setNftMintStatus={setNftMintStatus}  />}

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-400 flex items-center">
              <Trophy className="mr-2" /> Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full bg-gray-700" />
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {leaderboard.map((user, index) => (
                  //@ts-expect-error ignore
                  <li key={user.walletAddress} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <span className="flex items-center">
                      <span className={`text-lg font-semibold mr-2 ${getRankColor(index)}`}>{getRankIcon(index) || `${index + 1}.`}</span>
                    {/* @ts-expect-error ignore */}
                      <span className="text-gray-300 ml-2">{user.name}</span>
                    </span>
                    <Badge variant="secondary" className="bg-blue-600 text-gray-100 px-3 py-1">
                    {/* @ts-expect-error ignore */}
                      {user.points} pts
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;






// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useRecoilState } from "recoil";
// import { missionCount } from "@/store/userState";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, Clock, Check } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// const HomePage = () => {
//   const [liveMissions, setLiveMissions] = useState([]);
//   const [completedMissions, setCompletedMissions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const [totalMissionCount, setTotalMissionCount] = useRecoilState(missionCount);

//   useEffect(() => {
//     const fetchMissions = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch("/api/missions");
//         const data = await res.json();
//         setLiveMissions(data.liveMissions);
//         setCompletedMissions(data.completedMissions);
//         setTotalMissionCount(data.liveMissions.length + data.completedMissions.length);
//       } catch (error) {
//         console.error("Failed to fetch missions:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMissions();
//   }, [totalMissionCount]);

//   const handleMissionClick = (missionId: string) => {
//     router.push(`/missions/${missionId}`);
//   };

//   //@ts-expect-error tyes ignore
//   const getTimeRemaining = (deadline: Date, isCompleted) => {
//     if (isCompleted) {
//       return `Completed on ${new Date(deadline).toLocaleDateString()}`;
//     }

//     const now = new Date();
//     //@ts-expect-error tyes ignore
//     const timeRemaining = new Date(deadline) - now;
//     const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
//     const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));

//     if (daysRemaining > 0) {
//       return `${daysRemaining} day${daysRemaining > 1 ? "s" : ""} remaining`;
//     } else if (hoursRemaining > 0) {
//       return `${hoursRemaining} hour${hoursRemaining > 1 ? "s" : ""} remaining`;
//     } else {
//       return "Deadline passed";
//     }
//   };

//   //@ts-expect-error tyes ignore
//   const MissionCard = ({ mission, isCompleted }) => (
//     <Card
//       className="bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-300 cursor-pointer border-gray-700"
//       onClick={() => handleMissionClick(mission._id)}
//     >
//       <CardHeader className="p-0">
//         {mission.image ? (
//           <img src={mission.image} alt={mission.title} className="w-full h-40 object-cover rounded-t-lg" />
//         ) : (
//           <div className="w-full h-40 bg-gray-700 rounded-t-lg" />
//         )}
//       </CardHeader>
//       <CardContent className="p-4">
//         <CardTitle className="text-xl font-bold mb-2 text-gray-100">{mission.title}</CardTitle>
//         <p className="text-gray-300 mb-4 line-clamp-2">{mission.description}</p>
//         <p className="text-sm text-gray-400 mb-3">Mission created by: {mission.creator?.name || "Unknown"}</p>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center text-gray-300">
//             <Calendar className="w-4 h-4 mr-1" />
//             <span className="text-sm">{getTimeRemaining(mission.deadline, isCompleted)}</span>
//           </div>
//           {/* @ts-expect-error tyes ignore */}
//           <Badge variant={isCompleted ? "success" : "secondary"} className="bg-blue-600 text-gray-100">
//             {isCompleted ? (
//               <>
//                 <Check className="w-4 h-4 mr-1" />
//                 Completed
//               </>
//             ) : (
//               <>
//                 <Clock className="w-4 h-4 mr-1" />
//                 Active
//               </>
//             )}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const SkeletonCard = () => (
//     <Card className="bg-gray-800 border-gray-700">
//       <CardHeader className="p-0">
//         <Skeleton className="w-full h-40 bg-gray-700" />
//       </CardHeader>
//       <CardContent className="p-4">
//         <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
//         <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
//         <Skeleton className="h-4 w-full bg-gray-700 mb-4" />
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-4 w-1/3 bg-gray-700" />
//           <Skeleton className="h-6 w-1/4 bg-gray-700" />
//         </div>
//       </CardContent>
//     </Card>
//   );

//   //@ts-expect-error tyes ignore
//   const renderMissionCards = (missions, isCompleted) => {
//     if (isLoading) {
//       return Array(3)
//         .fill(0)
//         .map((_, index) => <SkeletonCard key={index} />);
//     }
//     //@ts-expect-error tyes ignore
//     return missions.map((mission) => <MissionCard key={mission._id} mission={mission} isCompleted={isCompleted} />);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
//       {/* <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400">Mission Dashboard</h1> */}
//       <div className="mb-12">
//         <h2 className="text-2xl font-bold mb-4 text-gray-300">Live Missions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderMissionCards(liveMissions, false)}</div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold mb-4 text-gray-300">Completed Missions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderMissionCards(completedMissions, true)}</div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
