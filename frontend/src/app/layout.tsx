import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ThreadCounty",
  },
  themeColor: "#000000",
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
        
        {/* Google Translate Script */}
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new window.google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
