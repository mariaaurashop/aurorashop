import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AuroraShop",
  description: "Tu tienda online potenciada con IA.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        ><main className="min-h-screen flex flex-col ">
              <div className="flex-1 w-full flex flex-col ">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 ">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-2 flex-row items-center font-semibold">
                      <ShoppingBagIcon className="text-2xl text-neutral-500  font-bold w-8 h-8"/>
                      <Link href={"/"} className="text-2xl text-neutral-500  font-bold md:flex hidden">AuroraShop</Link>
                    </div>
                    <AuthButton/>
                  </div>
                </nav>
          {children}
          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 relative bg-white z-20">
          <p>
            Hecho por Maria fernanda
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>

        </ThemeProvider>
      </body>
    </html>
  );
}
