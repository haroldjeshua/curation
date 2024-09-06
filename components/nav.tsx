import { Logo } from "./logo/logo";
import NavMenu from "./nav-menu";

const navlinks = [
  { name: "Inspiration", href: "/" },
  { name: "Tools", href: "/" },
  { name: "Resources", href: "/" },
  { name: "Learning", href: "/" },
  { name: "Blogs", href: "/" },
];

export default function Nav() {
  return (
    <nav className="fixed left-4 top-4 flex h-10 items-center justify-between gap-4 rounded-md border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-xl font-bold"
          title="Curation"
          aria-label="Curation"
        >
          <Logo className="aspect-square size-4 -rotate-90" />
        </a>
        <div className="flex md:hidden">
          <NavMenu />
        </div>
        <div className="hidden items-center justify-between gap-4 md:flex">
          {navlinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors ease-linear hover:text-foreground"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
