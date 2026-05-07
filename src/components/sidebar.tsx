"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Wrench,
  History,
  Settings,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

type Tool = {
  name: string;
  href: string;
  description: string;
  comingSoon?: boolean;
  category?: string;
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
          "flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="font-bold text-lg">LLMUtils</span>}
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
                  className="w-full justify-center px-0 mt-2"
                  size="icon"
                >
                  <Wrench className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-64">
                {Object.entries(
                  tools.reduce((acc, tool) => {
                    const cat = tool.category || "Other";
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(tool);
                    return acc;
                  }, {} as Record<string, typeof tools>)
                ).map(([category, categoryTools]) => (
                  <>
                    <DropdownMenuItem className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
                      {category}
                    </DropdownMenuItem>
                    {categoryTools.map((tool) => (
                      <DropdownMenuItem
                        key={tool.href}
                        asChild
                        disabled={tool.comingSoon}
                      >
                        <Link href={tool.comingSoon ? "#" : tool.href} className="flex items-center justify-between w-full">
                          <span>{tool.name}</span>
                          {tool.comingSoon && (
                            <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">
                              Soon
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!collapsed && (
            <>
              <div className="mt-6 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Tools
              </div>
              {Object.entries(
                tools.reduce((acc, tool) => {
                  const cat = tool.category || "Other";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(tool);
                  return acc;
                }, {} as Record<string, typeof tools>)
              ).map(([category, categoryTools]) => (
                <div key={category} className="mb-3">
                  <div className="mb-1 px-3 text-[10px] font-medium text-muted-foreground/70">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {categoryTools.map((tool) =>
                      tool.comingSoon ? (
                        <div
                          key={tool.href}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground bg-muted/30"
                          title="Coming soon"
                        >
                          <span>{tool.name}</span>
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium">
                            Soon
                          </span>
                        </div>
                      ) : (
                        <Link key={tool.href} href={tool.href} passHref>
                          <Button
                            variant={pathname === tool.href ? "secondary" : "ghost"}
                            className="w-full justify-start text-sm h-9"
                            size="sm"
                          >
                            {tool.name}
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ))}
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

        <div className="border-t p-3 space-y-1 mt-auto">
          {!collapsed && (
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
              {email}
            </div>
          )}
          {!collapsed && email && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            className={cn(
              "w-full transition-all",
              collapsed ? "justify-center" : "justify-start gap-2"
            )}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
    </div>
  );
}
