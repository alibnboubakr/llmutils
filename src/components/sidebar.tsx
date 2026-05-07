"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Wrench,
  History,
  Settings,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

type Tool = {
  name: string;
  href: string;
  description: string;
  comingSoon?: boolean;
};

const tools: Tool[] = [
  { name: "Markdown", href: "/markdown", description: "Web to Markdown" },
  { name: "Sanitize", href: "/sanitize", description: "Context Sanitizer" },
  { name: "Un-Sanitize", href: "/un-sanitizer", description: "Restore masked values" },
  { name: "JSON", href: "/json", description: "Unstructured to JSON" },
  { name: "JSON Formatter", href: "/json-formatter", description: "Format & validate JSON" },
  { name: "CSV to JSON", href: "/csv-to-json", description: "Upload CSV → JSON" },
  { name: "Regex", href: "/regex", description: "English to Regex" },
  { name: "Diff", href: "/diff", description: "Compare Prompts" },
  { name: "Markdown Preview", href: "/markdown-preview", description: "Render LLM Output" },
  { name: "HTML to JSX", href: "/html-to-jsx", description: "For React Devs" },
  { name: "Code Minifier", href: "/code-minifier", description: "Minify code" },
  { name: "Token Estimator", href: "/token-estimator", description: "Estimate tokens & cost" },
  { name: "Chat Exporter", href: "/chat-exporter", description: "Export chat transcripts" },
  { name: "Image OCR", href: "/image-ocr", description: "Extract text from images", comingSoon: true },
  { name: "Transcribe", href: "/transcribe", description: "YouTube → Text", comingSoon: true },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (active) setEmail(user?.email ?? "");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? "");
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Don't show sidebar on landing or auth pages
  const hideSidebar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/");
  if (hideSidebar) return <>{children}</>;

  async function onSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex h-screen">
      <aside
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">L</span>
            </div>
            {!collapsed && <span className="font-semibold">LLMUtils</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <Link href="/dashboard" passHref>
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className={cn("w-full justify-start", collapsed && "justify-center px-0")}
            >
              <Home className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Dashboard</span>}
            </Button>
          </Link>

          {collapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-center px-0 mt-1"
                >
                  <Wrench className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                {tools.map((tool) => (
                  <DropdownMenuItem
                    key={tool.href}
                    asChild
                    disabled={tool.comingSoon}
                  >
                    <Link href={tool.comingSoon ? "#" : tool.href}>
                      <span>{tool.name}</span>
                      {tool.comingSoon && (
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!collapsed && (
            <>
              <div className="mt-4 mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tools
              </div>
              <div className="space-y-1">
                {tools.map((tool) =>
                  tool.comingSoon ? (
                    <div
                      key={tool.href}
                      className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground"
                      title="Coming soon"
                    >
                      <span>{tool.name}</span>
                      <span className="text-[10px] uppercase tracking-wider">
                        Soon
                      </span>
                    </div>
                  ) : (
                    <Link key={tool.href} href={tool.href} passHref>
                      <Button
                        variant={pathname === tool.href ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm"
                      >
                        {tool.name}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </>
          )}

          <div className="mt-4 space-y-1">
            <Link href="/history" passHref>
              <Button
                variant={pathname === "/history" ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed && "justify-center px-0")}
              >
                <History className="h-4 w-4" />
                {!collapsed && <span className="ml-2">History</span>}
              </Button>
            </Link>

            <Link href="/settings" passHref>
              <Button
                variant={pathname === "/settings" ? "secondary" : "ghost"}
                className={cn("w-full justify-start", collapsed && "justify-center px-0")}
              >
                <Settings className="h-4 w-4" />
                {!collapsed && <span className="ml-2">Settings</span>}
              </Button>
            </Link>
          </div>
        </nav>

        <div className="border-t p-2 space-y-1">
          {!collapsed && <ThemeToggle />}
          {!collapsed && email && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
              {email}
            </div>
          )}
          {!collapsed && email && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
