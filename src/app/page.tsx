"use client";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Footprints, Medal, User, Award, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { userCount, userState } from "@/store/userState";
import { createAsset } from "@/lib/createAsset";
import { useWallet } from "@solana/wallet-adapter-react";
import NftModal from "@/components/NFTDisplayModal";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface DailyProgress {
  date: string;
  stepsWalked: number;
  dailyPoints: number;
}

interface NFT {
  name: string;
  image: string;
}

interface UserProgress {
  name: string;
  totalPoints: number;
  totalSteps: number;
  dailyProgress: DailyProgress[];
  nftsReceived: NFT[];
}

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stepsWalked, setStepsWalked] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const userInfo = useRecoilValue(userState);
  const usersCount = useRecoilValue(userCount);
  const [nftMintStatus, setNftMintStatus] = useState(false);
  const [showMint, setShowMint] = useState(false);
  const [nftType, setNftType] = useState<null | string>(null);
  const wallet = useWallet();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("leaderboard fetch fn called!!");              
      const helloRes = await fetch(`/api/users/hello`);
      console.log("hello Api Response : ",helloRes);
      const helloApiData=await helloRes.json();
      console.log("hello Api Response Data : ",helloApiData);
      
      const leaderboardRes = await fetch("/api/users/leaderboard",{
        method:"GET",
        cache: 'no-store',
        headers: {
        'Cache-Control': 'no-cache',
        }
      });
      console.log("leaderBoardResponse",leaderboardRes);
      const leaderboardData = await leaderboardRes.json();
      console.log("leaderBoardData",leaderboardData);
      //@ts-expect-error ignore
      const sortedLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);
      setLeaderboard(sortedLeaderboard);
      console.log("sorted leaderBoardData",sortedLeaderboard);

      //@ts-expect-error ignore
      if (userInfo?.walletAddress) {
        //@ts-expect-error ignore
        const userProgressRes = await fetch(`/api/users?walletAddress=${userInfo.walletAddress}`);
        if (userProgressRes.ok) {
          const userProgressData = await userProgressRes.json();
          setUserProgress(userProgressData);
        } else {
          console.error('Failed to fetch user progress');
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    //@ts-expect-error ignore
  }, [usersCount, userInfo?.walletAddress]);

  //@ts-expect-error ignore
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
        fetchData();
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


  return (

    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: User Progress (60% width) */}
        <div className="lg:w-[70vw]">
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-blue-400 flex items-center">
                <User className="mr-2" /> User Progress
              </CardTitle>
              {/* <CardTitle className="text-xl font-bold text-blue-400 flex justify-between items-center">
                <div className='flex items-center'><User className="mr-2" /> User Progress</div>
                <p className='font-medium text-lg'>Name  :  {userProgress.name}</p>
              </CardTitle> */}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full bg-gray-700" />
              ) : userProgress ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-400 pl-6">Name : {userProgress.name}</h3>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <Footprints className="w-4 h-4 mr-1 text-blue-400" />
                        <span className="text-sm text-blue-300">{userProgress.totalSteps} Total Steps</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1 text-yellow-400" />
                        <span className="text-sm text-yellow-500">{userProgress.totalPoints} Total Points</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userProgress.dailyProgress}>
                      <XAxis 
                        dataKey="date" 
                        stroke="#718096" 
                        tick={{fill: '#718096'}}
                      />
                      <YAxis 
                        yAxisId="left" 
                        stroke="#4299E1" 
                        tick={{fill: '#4299E1'}}
                        label={{ value: 'Steps', angle: -90, position: 'insideLeft', fill: '#4299E1' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#F6E05E" 
                        tick={{fill: '#F6E05E'}}
                        label={{ value: 'Points', angle: 90, position: 'insideRight', fill: '#F6E05E' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#2D3748', border: 'none', color: '#E2E8F0' }} 
                        itemStyle={{ color: '#E2E8F0' }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#E2E8F0' }}
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="stepsWalked" 
                        stroke="#4299E1" 
                        name="Steps" 
                        dot={false}
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="dailyPoints" 
                        stroke="#F6E05E" 
                        name="Points" 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div>
                    <h4 className="text-md font-semibold mb-2 text-gray-300">NFT Badges</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {userProgress.nftsReceived.map((nft, index) => (
                        <div key={index} className="text-center">
                          <img src={nft.image} alt={nft.name} className="w-12 h-12 mx-auto mb-1 rounded-full" />
                          <p className="text-xs text-gray-400">{nft.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Connect your wallet to view progress</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Daily Progress and Leaderboard (40% width) */}
        <div className="lg:w-[30vw] space-y-6">
          {/* Daily Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-blue-400 flex items-center">
                <Activity className="mr-2" /> Daily Progress
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
              {showMint && (
                <Button
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => createAsset(wallet, nftType, setNftMintStatus, setShowMint)}
                >
                  Mint NFT Badge
                </Button>
              )}
              {nftMintStatus && (
                <Button
                  disabled
                  className="mt-4 w-full bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  NFT Minted Successfully!
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-blue-400 flex items-center">
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
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    //@ts-expect-error ignore
                    <div key={user.walletAddress} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                      <span className="flex items-center">
                        <span className={`text-lg font-semibold mr-2 ${getRankColor(index)}`}>
                          {getRankIcon(index) || `${index + 1}.`}
                        </span>
                        {/* @ts-expect-error ignore */}
                        <span className="text-gray-300 ml-2 truncate">{user.name}</span>
                      </span>
                      <Badge variant="secondary" className="bg-blue-600 text-gray-100 px-3 py-1">
                        {/* @ts-expect-error ignore */}
                        {user.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {nftMintStatus && <NftModal trackName={nftType} setNftMintStatus={setNftMintStatus} />}
    </div>


  );
};

export default HomePage;