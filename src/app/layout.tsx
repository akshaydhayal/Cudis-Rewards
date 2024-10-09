"use client";
// app/layout.tsx
import WalletConnectProvider from "@/components/WalletProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";
// import MissionModal from "@/components/MissionModal";
import { RecoilRoot } from "recoil";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log(isModalOpen);
  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        <WalletConnectProvider>
          <RecoilRoot>
            {/* <Navbar onCreateMissionClick={() => setIsModalOpen(true)} /> */}
            <Navbar/>
            <main className="p-4">{children}</main>
            {/* <MissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
          </RecoilRoot>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
