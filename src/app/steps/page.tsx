import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
// import React from 'react';
// import { FaWalking } from "react-icons/fa";

// const StepCounter = ({ steps=100000, goal=100000 }) => {
//   const percentage = (steps / goal) * 100;
//   const strokeWidth = 10;
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDasharray = `${circumference} ${circumference}`;
//   const strokeDashoffset = circumference - (percentage / 100) * circumference;

//   return (
//     <div className="relative w-64 h-64 bg-black rounded-full flex items-center justify-center">
//       <svg className="w-full h-full" viewBox="0 0 200 200">
//         <circle
//           cx="100"
//           cy="100"
//           r={radius}
//           fill="none"
//           stroke="#1e3a5f"
//           strokeWidth={strokeWidth}
//         />
//         <circle
//           cx="100"
//           cy="100"
//           r={radius}
//           fill="none"
//           stroke="#00ffff"
//           strokeWidth={strokeWidth}
//           strokeDasharray={strokeDasharray}
//           strokeDashoffset={strokeDashoffset}
//           strokeLinecap="round"
//           transform="rotate(-90 100 100)"
//         />
//       </svg>
//       <div className=" absolute inset-0 flex flex-col items-center mt-12 text-white">
//         {/* <Circle className="w-6 h-6 mb-2" /> */}
//         {/* <Footprints className="w-8 h-8 mb-2"/> */}
//         <FaWalking className="w-12 h-12 mb-1 "/>
//         {/* <div className="text-5xl font-bold ">{steps} </div> */}
//         <div className="text-6xl font-bold tracking-tighter font-sans">{steps} </div>
//         {/* <div className="text-sm">/ {goal} STEPS</div> */}
//       </div>
//       <div className="absolute left-0 bottom-0 w-3 h-3 bg-orange-500 rounded-full transform -translate-x-1/2 translate-y-1/2" />
//     </div>
//   );
// };

// export default StepCounter;