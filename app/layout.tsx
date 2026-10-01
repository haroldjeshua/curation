import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnnotationTools } from "@/components/annotation-tools";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Curation", template: "%s · Curation" },
  description: "A personal, annotated reference library for design engineers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="w-full flex-1 px-4 pt-16">{children}</main>
            <SiteFooter />
            <AnnotationTools />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
