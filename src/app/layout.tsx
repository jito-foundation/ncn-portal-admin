import "./globals.scss";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { getServerSession } from "next-auth";

import SessionProvider from "../components/Provider/SessionProvider";
import { ChainContextProvider } from "@/components/Provider/ChainContextProvider";
import ThemesProvider from "@/providers/ThemesProvider";
import { SelectedWalletAccountContextProvider } from "@/components/context/SelectedWalletAccountContextProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ThemesProvider>
          <ChainContextProvider>
            <SelectedWalletAccountContextProvider>
              <SessionProvider session={session}>
                <div className="dark:bg-boxdark-2 dark:text-bodydark">
                  {children}
                </div>
              </SessionProvider>
            </SelectedWalletAccountContextProvider>
          </ChainContextProvider>
        </ThemesProvider>
      </body>
    </html>
  );
}
