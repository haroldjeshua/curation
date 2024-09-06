import { Logo } from "./logo/logo";

const navlinks = [
  { name: "Inspiration", href: "/" },
  { name: "Tools", href: "/" },
  { name: "Resources", href: "/" },
  { name: "Learning", href: "/" },
  { name: "Blogs", href: "/" },
];

export default function Nav() {
  return (
    <nav className="fixed top-4 left-4 flex items-center justify-between gap-4 p-3 bg-background/50 border border-border/50 backdrop-blur-sm rounded-xl">
      <div className="flex items-center gap-4">
        <a href="/" className="text-xl font-bold">
          <Logo className="size-8 -rotate-90 aspect-square" />
        </a>
        {navlinks.map((link) => (
          <a key={link.name} href={link.href} className="text-md font-medium">
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
