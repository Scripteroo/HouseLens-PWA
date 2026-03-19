import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HouseLens",
  description: "Instant property intelligence from your phone",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "HouseLens" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, viewportFit: "cover", themeColor: "#007AFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><link rel="apple-touch-icon" href="/icons/icon-192.png" /></head>
      <body className="font-sans antialiased">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});})}` }} />
      </body>
    </html>
  );
}
