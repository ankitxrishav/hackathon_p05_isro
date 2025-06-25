import { Wind } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Wind className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-primary-foreground tracking-tight">
            BreatheEasy
          </h1>
        </div>
      </div>
    </header>
  );
}
