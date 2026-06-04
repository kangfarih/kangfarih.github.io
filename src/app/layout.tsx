import "./globals.css";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";
import { Lato } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("https://kangfarih.github.io"),
  title: {
    default: "Farih Muhammad",
    template: "%s | Farih Muhammad",
  },
  description: "Portfolio and personal blog of Farih Muhammad.",
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans",
});

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cx("text-[color:var(--page-fg)] bg-[color:var(--page-bg)]", lato.variable, GeistMono.variable)}
    >
      <body className="antialiased">
        <div className="fixed inset-x-0 top-0 z-50">
          <Navbar />
        </div>
        <main className="mx-auto flex min-w-0 max-w-6xl flex-auto flex-col px-4 pb-20 pt-20 sm:px-6 lg:px-8">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
