import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://llmutils.co";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const viewport: Viewport = {
  themeColor: "#09090f",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PromptScore — Rate your AI prompt in seconds",
    template: "%s | PromptScore",
  },
  description:
    "Paste any ChatGPT, Claude, or Gemini prompt and get an instant 0-100 score, a brutal roast, and a rewritten version that actually works. Free, no signup.",
  keywords: [
    "prompt grader",
    "rate my prompt",
    "prompt score",
    "prompt engineering checker",
    "improve AI prompts",
    "ChatGPT prompt checker",
  ],
  openGraph: {
    title: "PromptScore — How good is your prompt?",
    description:
      "Get your prompt scored 0-100 in one second. Free, instant, no signup.",
    url: SITE_URL,
    siteName: "PromptScore",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptScore — How good is your prompt?",
    description:
      "Get your prompt scored 0-100 in one second. Free, instant, no signup.",
  },
};

// Runs before paint so the saved theme applies without a flash.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=(t==="light"||t==="dark")?t:"dark"}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
        {ADSENSE_CLIENT && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
