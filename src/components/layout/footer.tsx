export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 mt-auto">
      <div className="container flex items-center justify-center h-16 max-w-screen-2xl px-4 md:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ankit, mehak, ashish, harsh
        </p>
      </div>
    </footer>
  );
}
