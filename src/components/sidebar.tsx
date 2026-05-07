"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wrench,
  History,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tools = [
  { name: "Markdown", href: "/markdown", description: "Web to Markdown" },
  { name: "Sanitize", href: "/sanitize", description: "Context Sanitizer" },
  { name: "JSON", href: "/json", description: "Unstructured to JSON" },
  { name: "CSV to JSON", href: "/csv-to-json", description: "Upload CSV → JSON" },
  { name: "Regex", href: "/regex", description: "English to Regex" },
  { name: "Diff", href: "/diff", description: "Compare Prompts" },
  { name: "Transcribe", href: "/transcribe", description: "YouTube → Text" },
  { name: "Markdown Preview", href: "/markdown-preview", description: "Render LLM Output" },
  { name: "HTML to JSX", href: "/html-to-jsx", description: "For React Devs" },
];

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();

  // Don't show sidebar on landing or auth pages
  const hideSidebar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/");
  if (hideSidebar) return <>{children}</>;

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start mt-1", collapsed && "justify-center px-0")}
              >
                <Wrench className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span className="ml-2">Tools</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            {!collapsed && (
              <DropdownMenuContent side="right" align="start" className="w-48">
                {tools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>{tool.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>

          {!collapsed && (
            <div className="mt-4 space-y-1">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href} passHref>
                  <Button
                    variant={pathname === tool.href ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                  >
                    {tool.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          <Link href="/history" passHref>
            <Button
              variant={pathname === "/history" ? "secondary" : "ghost"}
              className={cn("w-full justify-start mt-4", collapsed && "justify-center px-0")}
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
        </nav>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
