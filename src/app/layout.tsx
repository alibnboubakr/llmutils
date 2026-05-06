import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CmdKProvider } from "@/components/cmd-k";
import { SidebarProvider } from "@/components/sidebar";
import { ensureEnvVars } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLMUtils — The Missing Toolbox for AI Workers",
  description:
    "Stop wrestling with context, formats, and API costs. Build prompts faster, safer.",
};

// Validate environment variables on server startup
if (typeof window === 'undefined') {
  ensureEnvVars();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <CmdKProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </CmdKProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
