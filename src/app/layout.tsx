import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://llmutils.co";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PromptScore — Rate your AI prompt in seconds",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
