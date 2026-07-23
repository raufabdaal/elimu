import type { Metadata, Viewport } from "next";
import PWAControls from "@/components/PWAControls";
import AccountBootstrap from "@/components/AccountBootstrap";
import AuthGate from "@/components/AuthGate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elimu · Uganda Primary P4–P7 Edtech",
  description:
    "Uganda National Curriculum Development Centre (NCDC) & UNEB PLE interactive primary question banks across P4–P7. Offline PWA ready.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d7a54",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PWAControls />
        <AccountBootstrap />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
