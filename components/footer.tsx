import ThemeSwitcher from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="flex h-16 w-full items-center justify-between border-t border-border bg-background/50 px-4 py-4">
      <p className="text-sm text-muted-foreground">
        © 2024 Harv &middot; All rights reserved.
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
