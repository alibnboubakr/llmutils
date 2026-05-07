"use client";

import * as React from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calculator, Code2, FileJson, FileText, Globe, History, Home, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tools = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions",
  },
  {
    name: "Markdown",
    href: "/markdown",
    icon: FileText,
    description: "Convert web pages to markdown",
  },
  {
    name: "Sanitize",
    href: "/sanitize",
    icon: Shield,
    description: "Mask API keys and PII",
  },
  {
    name: "JSON Formatter",
    href: "/json",
    icon: FileJson,
    description: "Convert unstructured text to JSON",
  },
  {
    name: "CSV to JSON",
    href: "/csv-to-json",
    icon: Code2,
    description: "Upload CSV and convert to JSON",
  },
  {
    name: "Regex Generator",
    href: "/regex",
    icon: Calculator,
    description: "English to regex converter",
  },
  {
    name: "Diff Tool",
    href: "/diff",
    icon: FileText,
    description: "Compare prompt versions",
  },
  {
    name: "Transcribe",
    href: "/transcribe",
    icon: Globe,
    description: "YouTube URL to text",
  },
  {
    name: "Markdown Preview",
    href: "/markdown-preview",
    icon: FileText,
    description: "Render LLM markdown output",
  },
  {
    name: "HTML to JSX",
    href: "/html-to-jsx",
    icon: Code2,
    description: "Convert HTML to JSX",
  },
];

export function CmdKProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {tools.map((tool) => (
              <CommandItem
                key={tool.href}
                onSelect={() => runCommand(() => router.push(tool.href))}
              >
                <tool.icon className="mr-2 h-4 w-4" />
                <span>{tool.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {tool.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Account">
            <CommandItem onSelect={() => runCommand(() => router.push("/history"))}>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
