import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata={title:{default:"PhishGuard — AI Phishing Detection","template":"%s · PhishGuard"},description:"Analyze suspicious links and messages before they become incidents."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="noise min-h-screen">{children}</body></html>}
