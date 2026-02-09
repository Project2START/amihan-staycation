import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ApolloClientProvider from "./shared/components/ApolloClientProvider";
import StoreProvider from "@/lib/StoreProvider";
import {
  mantineHtmlProps,
  MantineProvider,
  ColorSchemeScript,
} from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="min-h-[100dvh] flex flex-col">
        <StoreProvider>
          <ApolloClientProvider>
            <MantineProvider>{children}</MantineProvider>
            <Toaster
              position="bottom-right"
              containerStyle={{ bottom: "4.5rem" }}
            />
          </ApolloClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
