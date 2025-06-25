
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Wind, LayoutDashboard, BarChart3, BrainCircuit, LogOut, Map, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import HealthAdvisory from "../dashboard/health-advisory";

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trends', label: 'Trends', icon: BarChart3 },
  { href: '/forecast', label: 'Forecast', icon: BrainCircuit },
  { href: '/map', label: 'Heatmap', icon: Map },
];

const bottomLinks = [
    { href: '#logout', label: 'Logout', icon: LogOut },
]

export function Sidebar() {
  const pathname = usePathname();

  const renderLink = (link: any, index: number) => {
    const Icon = link.icon;
    const isActive = pathname === link.href;
    return (
        <TooltipProvider key={index} delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-center h-12 w-12 rounded-lg transition-colors hover:bg-primary/20 hover:text-primary",
                          isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Icon className="h-6 w-6" />
                        <span className="sr-only">{link.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{link.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
  }

  return (
    <aside className="hidden md:flex flex-col items-center w-20 bg-card border-r py-4 z-40">
      <Link href="/" className="mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Wind className="h-8 w-8 text-primary" />
        </div>
      </Link>
      <nav className="flex flex-col items-center gap-4">
        {navLinks.map(renderLink)}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-4">
        <Dialog>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <button className="flex items-center justify-center h-12 w-12 rounded-lg transition-colors hover:bg-primary/20 hover:text-primary text-muted-foreground">
                                <ShieldAlert className="h-6 w-6" />
                                <span className="sr-only">Health Advisory</span>
                            </button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Health Advisory</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-primary" />
                        Health Advisory
                    </DialogTitle>
                </DialogHeader>
                <HealthAdvisory />
            </DialogContent>
        </Dialog>

        {bottomLinks.map(renderLink)}
      </div>
    </aside>
  );
}
