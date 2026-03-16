import { Press_Start_2P, VT323 } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-pixel-body",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "PomoPet",
  description: "Gamified pomodoro productivity app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${vt323.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
