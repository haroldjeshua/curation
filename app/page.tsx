import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config/site";
import {
  BookHeart,
  BoxSelect,
  Newspaper,
  PackageOpen,
  Sparkles,
  Wrench,
} from "lucide-react";

type Route = {
  name: string;
  href: string;
  label: string;
  icon: React.ReactNode;
};

const routeIconMap: Record<string, React.ReactNode> = {
  inspiration: <Sparkles className="size-16" strokeWidth={1} />,
  tools: <Wrench className="size-16" strokeWidth={1} />,
  resources: <PackageOpen className="size-16" strokeWidth={1} />,
  learning: <BookHeart className="size-16" strokeWidth={1} />,
  blogs: <Newspaper className="size-16" strokeWidth={1} />,
};

interface RouteWithIcon extends Route {
  icon: React.ReactNode;
}

const defaultIcon = <BoxSelect />;

const routeWithIcons: RouteWithIcon[] = siteConfig.routes.map((route) => {
  const icon = routeIconMap[route.name] || defaultIcon; // Fallback to default icon
  return {
    ...route,
    icon,
  };
});

console.log(routeWithIcons);

export default function Home() {
  return (
    <>
      <section className="w-full px-4 pb-12 pt-24">
        <h1 className="text-5xl font-bold">Curation</h1>
        <p className="text-sm text-muted-foreground">
          Curated design inspiration and resources
        </p>
      </section>

      <ScrollArea>
        <section className="relative flex min-h-[calc(100vh-216px)] w-full flex-row flex-nowrap gap-4 overflow-y-auto px-4 pb-4">
          {routeWithIcons.map((route) => (
            <div
              key={route.name}
              className="flex h-auto w-1/3 min-w-44 flex-col items-center justify-center rounded-xl bg-foreground/15 backdrop-blur transition-colors ease-linear hover:bg-foreground/25 supports-[backdrop-filter]:bg-foreground/15"
            >
              <a
                href={route.href}
                className="flex size-full flex-col items-center justify-center p-4 text-center"
              >
                <span>{route.icon}</span>
                <p className="mt-2 text-sm text-muted-foreground">
                  {route.label}
                </p>
              </a>
            </div>
          ))}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
