"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavbarLink =
  | { type: "anchor"; label: string; href: string }
  | { type: "route"; label: string; href: string };

export function Navbar({
  brandName,
  logoSrc,
  links,
}: {
  brandName: string;
  logoSrc: string;
  links: NavbarLink[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isContentRoute = pathname?.startsWith("/portfolios") || pathname?.startsWith("/posts");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const { anchorLinks, routeLinks } = useMemo(() => {
    return {
      anchorLinks: isHome ? links.filter((l) => l.type === "anchor") : [],
      routeLinks: isHome ? links.filter((l) => l.type === "route") : [],
    };
  }, [isHome, links]);

  const hasLinks = anchorLinks.length > 0 || routeLinks.length > 0;

  return (
    <nav
      className={`navbar navbar-expand-xl top-navbar ${scrolled ? "final-navbar shadow" : "initial-navbar"}`}
      id="top-navbar"
    >
      <div className="container">
        {!isHome && isContentRoute ? (
          <button
            className="navbar-toggler navbar-dark"
            id="sidebar-toggler"
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => {
              const sidebar = document.getElementById("sidebar-section");
              const content = document.getElementById("content-section");
              const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;
              if (isTabletOrSmaller) {
                sidebar?.classList.toggle("hide");
                content?.classList.toggle("hide");
                return;
              }
              sidebar?.classList.toggle("collapsed");
              content?.classList.toggle("wide");
            }}
          >
            <span className="navbar-toggler-icon" />
          </button>
        ) : null}
        <Link className="navbar-brand" href="/">
          <img src={logoSrc} id="logo" alt="" />
          {brandName}
        </Link>
        {hasLinks ? (
          <>
            <button
              className="navbar-toggler navbar-dark"
              id="navbar-toggler"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="top-nav-items">
              <ul className="navbar-nav ml-auto">
                {anchorLinks.map((l) => (
                  <li className="nav-item" key={`anchor:${l.href}`}>
                    <a className="nav-link" href={l.href} onClick={() => setOpen(false)}>
                      {l.label}
                    </a>
                  </li>
                ))}
                {anchorLinks.length > 0 && routeLinks.length > 0 ? (
                  <div className="dropdown-divider" id="top-navbar-divider" />
                ) : null}
                {routeLinks.map((l) => (
                  <li className="nav-item" key={`route:${l.href}`}>
                    <Link
                      className="nav-link"
                      id={l.href === "/portfolios/" || l.href === "/portfolios" ? "blog-link" : undefined}
                      href={l.href}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
      <img src="/images/site/wind_hu_eb4f864b51fe454a.png" className="d-none" id="main-logo" alt="" />
      <img
        src="/images/site/inverted-wind_hu_532b9e69318ad189.png"
        className="d-none"
        id="inverted-logo"
        alt=""
      />
    </nav>
  );
}
