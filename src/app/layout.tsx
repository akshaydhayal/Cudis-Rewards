// app/layout.tsx
import "./globals.css";
import ClientWrapper from './ClientWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

// "use client";
// // app/layout.tsx
// import WalletConnectProvider from "@/components/WalletProvider";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import { RecoilRoot } from "recoil";

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         {/* <Navbar /> */}
//         <WalletConnectProvider>
//           <RecoilRoot>
//             <Navbar/>
//             <main className="p-4">{children}</main>
//           </RecoilRoot>
//         </WalletConnectProvider>
//       </body>
//     </html>
//   );
// }
