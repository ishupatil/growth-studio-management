import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
    title: "AI Social Media Growth Team",
    description: "Your Personal AI Growth Team for Instagram powered by CrewAI and Llama 3.1.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${playfairDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body bg-background text-text-primary antialiased`}>
                {children}
            </body>
        </html>
    );
}
