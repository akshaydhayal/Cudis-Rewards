import React, { useState, useEffect } from "react";

// const NftModal = ({ closeModal,nextQuestUrl,trackName }) => {
// const NftModal = ({setNftMintStatus, nextQuestUrl,trackName }) => {
                     
// @ts-expect-error ignore                    }
const NftModal = ({setNftMintStatus, trackName }) => {
  // console.log('t',nextQuestUrl);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-200 rounded-lg shadow-3xl p-6 flex flex-col items-center relative">
        {isLoading ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Wait, your NFT is getting minted...</h2>
            <div className="loader mt-4 border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Congrats!! You got an NFT</h2>
            <div className="bg-gray-100 rounded-lg shadow-md w-[305px] h-[350px] flex flex-col items-center mb-6">
              <div className="w-full h-1/2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-t-lg relative">
                <img
                  src={trackName == "beginner" ? "/beginner.png" : trackName == "intermediate" ? "/medium.png" : "/expert.png"}
                  alt="NFT Profile"
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {/* <img src="/solana.png" alt="NFT Profile" className="w-full h-full object-cover rounded-t-lg" /> */}
              </div>
              {/* <p className="text-center text-gray-800 font-semibold mt-2">Doodle #8978</p> */}
              {/* <p className="text-center text-gray-800 font-semibold mt-2">Cudis {trackName} NFT</p> */}
              <p className="text-center text-gray-800 font-semibold mt-2">Cudis {trackName=='beginner'?"Beginner":(trackName=='intermediate'?"Intermediate":"Expert")} NFT</p>
              <div className="p-3 flex flex-col items-center w-full">
                <p className="text-center text-gray-700 mb-3 text-sm">
                  Congratulations on completing the Cudis {trackName} Level! This NFT represents your achievement.
                </p>
                <div className="flex justify-center gap-1 items-center">
                  <p className="text-slate-700 font-semibold text-sm">Traits :</p>
                  <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">{trackName=='beginner'?"Beginner":(trackName=='intermediate'?"Intermediate":"Expert")}</div>
                  <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">{trackName=='beginner'?"1000 Steps":(trackName=='intermediate'?"5000 Steps":"10000 Steps")}</div>
                  <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">{trackName=='beginner'?"Walking":(trackName=='intermediate'?"Jogging":"Sprint")}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setNftMintStatus(false);
                  // closeModal(); /* Add functionality for next quest */
                }}
                className="bg-yellow-600 text-white rounded-xl px-4 py-2 font-semibold hover:bg-yellow-600 transition duration-300"
              >
                Close
              </button>
      
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NftModal;



// import React, { useState, useEffect } from "react";

// const NftModal = ({ closeModal }) => {
//   // State to track whether the NFT is loading or minted
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate the loading process
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 5000); // Simulate a 5-second loading time

//     return () => clearTimeout(timer); // Cleanup the timer on component unmount
//   }, []);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-slate-200 rounded-lg shadow-3xl p-6 flex flex-col items-center">
//         {isLoading ? (
//           <>
//             {/* Loading State */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Wait, your NFT is getting minted...</h2>
//             <div className="loader mt-4 border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
//           </>
//         ) : (
//           <>
//             {/* Congrats Text */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Congrats!! You got an NFT</h2>

//             {/* NFT Card */}
//             <div className="bg-gray-100 rounded-lg shadow-md w-[250px] h-[320px] flex flex-col items-center mb-6">
//               {/* Profile Picture */}
//               <div className="w-full h-1/2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-t-lg relative">
//                 <img src="/solana.png" alt="NFT Profile" className="w-full h-full object-cover rounded-t-lg" />
//               </div>

//               {/* NFT Title */}
//               <p className="text-center text-gray-800 font-semibold mt-2">Doodle #8978</p>

//               {/* NFT Details */}
//               <div className="p-3 flex flex-col items-center w-full">
//                 <p className="text-center text-gray-700 mb-3 text-sm">This is a rare and mystical NFT that represents the essence of creativity.</p>

//                 {/* Traits Section */}
//                 <div className="flex justify-center gap-1 items-center">
//                   <p className="text-slate-700 font-semibold text-sm">Traits :</p>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">Epic</div>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">Blue</div>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">NFT</div>
//                 </div>
//               </div>
//             </div>

//             {/* Close Button */}
//             <button onClick={closeModal} className="bg-yellow-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-yellow-600 transition duration-300">
//               Close
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NftModal;

// import React, { useState, useEffect } from "react";

// const NftModal = () => {
//   // State to track whether the NFT is loading or minted
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate the loading process
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 5000); // Simulate a 3-second loading time

//     return () => clearTimeout(timer); // Cleanup the timer on component unmount
//   }, []);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-slate-200 rounded-lg shadow-3xl p-6 flex flex-col items-center">
//         {isLoading ? (
//           <>
//             {/* Loading State */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Wait, your NFT is getting minted...</h2>
//             <div className="loader mt-4 border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
//           </>
//         ) : (
//           <>
//             {/* Congrats Text */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Congrats!! You got an NFT</h2>

//             {/* NFT Card */}
//             <div className="bg-gray-100 rounded-lg shadow-md w-[250px] h-[320px] flex flex-col items-center mb-6">
//               {/* Profile Picture */}
//               <div className="w-full h-1/2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-t-lg relative">
//                 <img src="/solana.png" alt="NFT Profile" className="w-full h-full object-cover rounded-t-lg" />
//               </div>

//               {/* NFT Title */}
//               <p className="text-center text-gray-800 font-semibold mt-2">Doodle #8978</p>

//               {/* NFT Details */}
//               <div className="p-3 flex flex-col items-center w-full">
//                 <p className="text-center text-gray-700 mb-3 text-sm">This is a rare and mystical NFT that represents the essence of creativity.</p>

//                 {/* Traits Section */}
//                 <div className="flex justify-center gap-1 items-center">
//                   <p className="text-slate-700 font-semibold text-sm">Traits :</p>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">Epic</div>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">Blue</div>
//                   <div className="border border-gray-700 rounded p-1 px-2 text-xs text-gray-700">NFT</div>
//                 </div>
//               </div>
//             </div>

//             {/* Close Button */}
//             <button
//               onClick={() => console.log("Close modal")}
//               className="bg-yellow-500 text-white rounded-full px-6 py-2 font-semibold hover:bg-yellow-600 transition duration-300"
//             >
//               Close
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NftModal;
