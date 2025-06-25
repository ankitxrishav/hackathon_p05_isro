
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BarChart3, BrainCircuit, LayoutDashboard, Map, Menu, Search, Wind } from "lucide-react";
import Link from "next/link";
import { useLocation } from "@/hooks/use-location";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trends', label: 'Trends', icon: BarChart3 },
  { href: '/forecast', label: 'Forecast', icon: BrainCircuit },
  { href: '/map', label: 'Heatmap', icon: Map },
];

export function Header() {
  const [searchValue, setSearchValue] = useState("");
  const { setLocation } = useLocation();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setLocation({ city: searchValue.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-4">
                    <Link href="/" className="mb-6 flex items-center gap-2 text-foreground no-underline">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Wind className="h-8 w-8 text-primary" />
                        </div>
                        <span className="font-bold text-lg">bxcd project</span>
                    </Link>
                    <nav className="flex flex-col gap-2 flex-1">
                        {navLinks.map(link => {
                           const Icon = link.icon;
                           const isActive = pathname === link.href;
                           return (
                             <Link
                               key={link.href}
                               href={link.href}
                               className={cn(
                                 "flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors hover:bg-primary/10",
                                 isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"
                               )}
                             >
                               <Icon className="h-6 w-6" />
                               {link.label}
                             </Link>
                           );
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
            <Link href="/" className="hidden md:flex items-center gap-2 text-foreground no-underline">
                <Wind className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">bxcd project</span>
            </Link>
        </div>
        
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search City..." 
            className="w-full rounded-lg bg-card pl-8" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
