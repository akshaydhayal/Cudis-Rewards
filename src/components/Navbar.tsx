// "use client";
// import { useEffect, useState, useCallback } from "react";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import "@solana/wallet-adapter-react-ui/styles.css";
// import NameModal from "./NameModal";
// import { useRecoilState, useSetRecoilState } from "recoil";
// import { userCount, userState } from "@/store/userState";
// import Link from "next/link";

// const colors = {
//   background: "#121212",
//   text: "#E0E0E0",
//   button: "#4A90E2",
//   buttonHover: "#6AB7E4",
// };

// export default function Navbar() {
//   const { publicKey } = useWallet();
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const setUser = useSetRecoilState(userState);
//   const [usersCount, setUsersCount] = useRecoilState(userCount);

//   // Memoize checkUserExists function
//   const checkUserExists = useCallback(async (walletAddress: string) => {
//     const response = await fetch("/api/users/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ walletAddress }),
//     });
//     const jsonResponse = await response.json();
//     if (jsonResponse.user) {
//       setUser(jsonResponse.user);
//     }
//     console.log("response: ", jsonResponse);

//     if (!response.ok) {
//       // User not found, show modal to enter name
//       setIsModalOpen(true);
//     }
//   }, [setUser]);
  
//   const handleRegister = async (name: string) => {
//     const registerResponse = await fetch("/api/users/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ walletAddress, name }),
//     });
    
//     const registerJsonResponse = await registerResponse.json();
//     console.log("registerResponse : ",registerJsonResponse);
    
//     if (registerResponse.ok) {
//       alert("User registered successfully!");
//       setUsersCount(usersCount + 1);
//       setUser(registerJsonResponse.user);
//     } else {
//       setErrorMessage(registerJsonResponse.error || "Error during registration");
//     }
//   };

//   // Automatically check if user exists when publicKey or walletAddress changes
//   useEffect(() => {
//     if (publicKey && !walletAddress) {
//       const address = publicKey.toString();
//       setWalletAddress(address);
//       checkUserExists(address);
//     }
//   }, [publicKey, walletAddress, checkUserExists]);

//   console.log("publicKey",publicKey?.toBase58());
//   return (
//     <nav style={{ backgroundColor: colors.background }} className="pt-1 px-4 flex justify-between items-center">
//       <Link href="/" className="text-3xl font-bold">
//         <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-green-500 animate-pulse">Cudis Rewards</span>
//       </Link>

//       <div className="flex items-center">
//         <WalletMultiButton />
//       </div>

//       {/* Error Message */}
//       {errorMessage && <p className="text-red-500">{errorMessage}</p>}

//       {/* Modal for entering user name */}
//       <NameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRegister} />
//     </nav>
//   );
// }


"use client";
import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import NameModal from "./NameModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userCount, userState } from "@/store/userState";
import Link from "next/link";

const colors = {
  background: "#121212",
  text: "#E0E0E0",
  button: "#4A90E2",
  buttonHover: "#6AB7E4",
};

export default function Navbar() {
  const { publicKey } = useWallet();
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [walletAddress, setWalletAddress] = useState("");
  const setUser = useSetRecoilState(userState);
  const [usersCount, setUsersCount] = useRecoilState(userCount);

  // Memoize checkUserExists function
  const checkUserExists = useCallback(async (walletAddress: string) => {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.user) {
      setUser(jsonResponse.user);
    }
    console.log("response: ", jsonResponse);

    if (!response.ok) {
      // User not found, show modal to enter name
      setIsModalOpen(true);
    }
  }, [setUser]);
  
  const handleRegister = async (name: string) => {
    const registerResponse = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ walletAddress, name }),
      body: JSON.stringify({ walletAddress: publicKey?.toString(), name }),
    });
    
    const registerJsonResponse = await registerResponse.json();
    console.log("registerResponse : ",registerJsonResponse);
    
    if (registerResponse.ok) {
      alert("User registered successfully!");
      setUsersCount(usersCount + 1);
      setUser(registerJsonResponse.user);
    } else {
      setErrorMessage(registerJsonResponse.error || "Error during registration");
    }
  };

  // Automatically check if user exists when publicKey or walletAddress changes
  useEffect(() => {
    // if (publicKey && !walletAddress) {
    if (publicKey) {
      const address = publicKey.toString();
      // setWalletAddress(address);
      checkUserExists(address);
    }
  }, [publicKey, checkUserExists]);
  // }, [publicKey, walletAddress, checkUserExists]);

  console.log("publicKey",publicKey?.toBase58());
  return (
    <nav style={{ backgroundColor: colors.background }} className="pt-1 px-4 flex justify-between items-center">
      <Link href="/" className="text-3xl font-bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-green-500 animate-pulse">Cudis Rewards</span>
      </Link>

      <div className="flex items-center">
        <WalletMultiButton />
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Modal for entering user name */}
      <NameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleRegister} />
    </nav>
  );
}