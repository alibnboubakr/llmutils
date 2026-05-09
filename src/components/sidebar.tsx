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
  Menu,
  X,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { ProBadge } from "@/components/pro-badge";
import { supabase } from "@/lib/supabase";
import { useUserPlan } from "@/lib/use-user-plan";

type Tool = {
  name: string;
  href: string;
  description: string;
  comingSoon?: boolean;
};

const tools: Tool[] = [
  { name: "Markdown", href: "/markdown", description: "Web to Markdown" },
  { name: "Sanitize", href: "/sanitize", description: "PII remover for AI prompts" },
  { name: "Token Estimator", href: "/token-estimator", description: "Estimate tokens & cost" },
  { name: "Prompt Diff", href: "/diff", description: "Compare prompts A/B" },
  { name: "Chat Exporter", href: "/chat-exporter", description: "Export chat transcripts" },
  { name: "JSON", href: "/json", description: "Unstructured to JSON" },
  { name: "Regex", href: "/regex", description: "English to Regex" },
];

function SidebarContent({
  pathname,
  collapsed,
  onLink,
}: {
  pathname: string;
  collapsed: boolean;
  onLink?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto p-2">
      <Link href="/dashboard" passHref onClick={onLink}>
        <Button
          variant={pathname === "/dashboard" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center px-0"
          )}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Dashboard</span>}
        </Button>
      </Link>

      {collapsed ? (
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
            {tools.map((tool) => (
              <DropdownMenuItem
                key={tool.href}
                asChild
                disabled={tool.comingSoon}
              >
                <Link
                  href={tool.comingSoon ? "#" : tool.href}
                  className="flex items-center justify-between w-full"
                  onClick={onLink}
                >
                  <span>{tool.name}</span>
                  {tool.comingSoon && (
                    <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <div className="mt-6 mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Tools
          </div>
          <div className="space-y-0.5">
            {tools.map((tool) =>
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
                <Link
                  key={tool.href}
                  href={tool.href}
                  passHref
                  onClick={onLink}
                >
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

      <div className="mt-6 space-y-1 border-t pt-3">
        <Link href="/prompts" passHref onClick={onLink}>
          <Button
            variant={pathname === "/prompts" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0"
            )}
          >
            <Sparkles className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Prompt Library</span>}
          </Button>
        </Link>

        <Link href="/history" passHref onClick={onLink}>
          <Button
            variant={pathname === "/history" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0"
            )}
          >
            <History className="h-4 w-4" />
            {!collapsed && <span className="ml-2">History</span>}
          </Button>
        </Link>

        <Link href="/settings" passHref onClick={onLink}>
          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center px-0"
            )}
          >
            <Settings className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Settings</span>}
          </Button>
        </Link>
      </div>
    </nav>
  );
}

function SidebarFooter({
  email,
  username,
  collapsed,
  onCollapseToggle,
  onSignOut,
  showCollapseButton,
}: {
  email: string;
  username?: string;
  collapsed: boolean;
  onCollapseToggle: () => void;
  onSignOut: () => void;
  showCollapseButton: boolean;
}) {
  const { isPro } = useUserPlan();

  return (
    <div className="border-t p-3 space-y-1 mt-auto">
      {!collapsed && (
        <div className="px-2 pt-1 pb-2 flex items-center justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            {username && (
              <div className="text-sm font-medium truncate">{username}</div>
            )}
            <div className="text-xs text-muted-foreground truncate">
              {email}
            </div>
          </div>
          {isPro && <ProBadge />}
        </div>
      )}
      {!collapsed && <ThemeToggle />}
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
      {showCollapseButton && (
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "w-full transition-all",
            collapsed ? "justify-center" : "justify-start gap-2"
          )}
          onClick={onCollapseToggle}
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
      )}
    </div>
  );
}

function SidebarHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-16 items-center border-b px-4">
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg">LLMUtils</span>
        )}
      </Link>
    </div>
  );
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    let active = true;
    function pickName(user: { user_metadata?: Record<string, unknown> } | null) {
      const meta = user?.user_metadata as
        | { username?: string; full_name?: string }
        | undefined;
      return meta?.username || meta?.full_name || "";
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      setEmail(user?.email ?? "");
      setUsername(pickName(user));
    });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user?.email ?? "");
        setUsername(pickName(session?.user ?? null));
      }
    );
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Close mobile drawer on route change.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Don't show sidebar on landing or auth pages.
  const hideSidebar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/auth/");
  if (hideSidebar) return <>{children}</>;

  async function onSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <SidebarHeader collapsed={collapsed} />
        <SidebarContent pathname={pathname} collapsed={collapsed} />
        <SidebarFooter
          email={email}
          username={username}
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed(!collapsed)}
          onSignOut={onSignOut}
          showCollapseButton
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold">LLMUtils</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account menu"
              className="rounded-full"
            >
              <div className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                {email ? email[0]?.toUpperCase() : "?"}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {email && (
              <DropdownMenuItem className="text-xs text-muted-foreground truncate">
                {email}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-background border-r shadow-xl flex flex-col">
            <div className="flex h-14 items-center justify-between border-b px-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold">LLMUtils</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent
              pathname={pathname}
              collapsed={false}
              onLink={() => setMobileOpen(false)}
            />
            <SidebarFooter
              email={email}
              username={username}
              collapsed={false}
              onCollapseToggle={() => {}}
              onSignOut={onSignOut}
              showCollapseButton={false}
            />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-muted/20 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
