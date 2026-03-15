import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Document Structurer AI",
  description: "Turn messy notes into clear structured reports in seconds. Perfect for meetings, brainstorming and raw ideas.",
  verification: {
    google: "VakcKCusPVDcSv1kaFjrMZhWJjiMZRyp3zBm1C0wJtI"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}