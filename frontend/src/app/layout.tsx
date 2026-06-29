import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ThreadCounty — AI-Powered Textile Analysis",
    template: "%s | ThreadCounty",
  },
  description:
    "AI-powered textile technology platform for fabric structure analysis. Upload fabric images and get instant thread density, weave information, and AI insights.",
  keywords: ["textile", "fabric analysis", "AI", "thread density", "weave pattern", "quality control"],
  openGraph: {
    title: "ThreadCounty — AI-Powered Textile Analysis",
    description: "Analyze fabric structures with AI and computer vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
