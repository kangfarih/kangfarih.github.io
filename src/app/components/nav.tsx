"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { siteProfile } from "@/content/profile";

const navItems: Array<{ href: string; label: string; match?: "exact" | "prefix" }> = [
  { href: "/", label: "Home", match: "exact" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About me" },
  { href: "/portfolios/", label: "Portfolios", match: "prefix" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const logoText = "FM";

  useEffect(() => {
    setHash(window.location.hash || "");
    const onHashChange = () => setHash(window.location.hash || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, match?: "exact" | "prefix") => {
    if (href.startsWith("/#")) {
      const target = href.slice(1);
      if (pathname !== "/") return false;
      if (!hash) return target === "#home";
      return hash === target;
    }
    if (match === "exact") return pathname === href;
    if (match === "prefix") return pathname?.startsWith(href.replace(/\/$/, "")) ?? false;
    return pathname === href;
  };

  return (
    <header
      className={`transition-colors ${
        scrolled ? "bg-[color:var(--page-bg)]/90 backdrop-blur border-b border-[color:var(--surface-border)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-3 sm:px-6 lg:px-8">
        <div className="hidden flex-1 items-center gap-8 lg:flex">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[color:var(--foundation-orange-normal)]">
          {logoText}
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-10" aria-label="Primary">
          {navItems.map((it) => {
            const active = isActive(it.href, it.match);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`text-sm font-semibold transition-colors ${
                  active
                    ? "text-[color:var(--foundation-orange-normal)]"
                    : "text-[color:var(--foundation-white-dark)] hover:text-[color:var(--foundation-orange-normal)]"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="w-10" />
        </div>

        <div className="flex flex-1 items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--surface-border)] text-[color:var(--page-fg)]"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <div className="flex flex-col gap-1">
            <span className="h-[2px] w-5 bg-current" />
            <span className="h-[2px] w-5 bg-current" />
            <span className="h-[2px] w-5 bg-current" />
          </div>
        </button>

        <Link
          href="/"
          className="flex-1 text-center text-xl font-extrabold tracking-tight text-[color:var(--foundation-orange-normal)]"
        >
          {logoText}
        </Link>

        <div className="h-10 w-10" />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-[320px] overflow-y-auto bg-[color:var(--page-bg)] p-5">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-lg font-extrabold tracking-tight text-[color:var(--foundation-orange-normal)]"
                onClick={() => setOpen(false)}
              >
                {logoText}
              </Link>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm text-[color:var(--muted-fg)] hover:bg-[color:var(--surface-bg)]"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {navItems.map((it) => {
                const active = isActive(it.href, it.match);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[color:var(--surface-bg)] text-[color:var(--foundation-orange-normal)]"
                        : "text-[color:var(--page-fg)] hover:bg-[color:var(--surface-bg)]"
                    }`}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
