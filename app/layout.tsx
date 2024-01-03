import Sidebar from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserID from "@/actions/getSongsByUserID";
import Player from "@/components/Player";
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify",
  description: "Build by Aviral Shukla",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const userSongs= await getSongsByUserID();
  
  const products = await getActiveProductsWithPrices();
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products}/>
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player/>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
