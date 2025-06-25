
"use client";

import { Input } from "@/components/ui/input";
import { Search, Wind } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search City..." className="w-full rounded-lg bg-card pl-8" />
        </div>
        <Link href="/" className="flex items-center gap-2 text-foreground no-underline">
            <Wind className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">bxcd project</span>
        </Link>
      </div>
    </header>
  );
}
