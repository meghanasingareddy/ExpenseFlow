
"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, IndianRupee } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We need to check the theme from the document on the client-side
    // to correctly set the initial state of the switch.
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">ExpenseFlow</h1>
        </div>
        <div className="flex items-center space-x-2">
           <Sun className="h-5 w-5 text-muted-foreground transition-colors" />
           <Switch id="theme-toggle" disabled={true} />
           <Moon className="h-5 w-5 text-muted-foreground transition-colors" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <IndianRupee className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight">ExpenseFlow</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Sun className="h-5 w-5 text-muted-foreground transition-colors" />
        <Switch
          id="theme-toggle"
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
        />
        <Moon className="h-5 w-5 text-muted-foreground transition-colors" />
      </div>
    </header>
  );
}
