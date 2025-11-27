import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ApolloClientProvider from "./(marketing)/components/ApolloClientProvider";

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
    <html lang="en" className={inter.className}>
      <body className="min-h-[100dvh] flex flex-col">
        <ApolloClientProvider>
          {children}
          <Toaster
            position="bottom-right"
            containerStyle={{ bottom: "4.5rem" }}
          />
        </ApolloClientProvider>
      </body>
    </html>
  );
}
