"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Profile } from "@/content/profile";

type Project = Profile["projects"][number];
type ProjectFilter = Profile["projectFilters"][number];

export function HomePortfolioSection({
  filters,
  projects,
}: {
  filters: ProjectFilter[];
  projects: Project[];
}) {
  const defaultFilter = useMemo(() => filters.find((f) => f.filter === "all")?.filter ?? filters[0]?.filter ?? "all", [filters]);
  const [active, setActive] = useState(defaultFilter);

  const visible = useMemo(() => {
    if (!active || active === "all") return projects;
    return projects.filter((p) => (p.tags ?? []).includes(active));
  }, [active, projects]);

  return (
    <section id="portfolio" className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-[color:var(--foundation-white-light)]">Portfolio</h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {filters.map((f) => {
          const isActive = f.filter === active;
          return (
            <button
              key={f.filter}
              type="button"
              onClick={() => setActive(f.filter)}
              className={`rounded-xl border px-5 py-2 text-sm font-semibold transition-colors hover:text-white hover:border-[color:var(--foundation-orange-normal)] hover:bg-[color:var(--foundation-orange-normal)] ${
                isActive
                  ? "border-[color:var(--foundation-orange-normal)] bg-[color:var(--foundation-orange-normal)] text-white"
                  : "border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] text-[color:var(--foundation-white-dark)] hover:bg-[color:var(--foundation-grey-dark)]"
              }`}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((p) => (
          <Link
            key={p.title}
            href={p.url}
            className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] p-5 transition-colors hover:bg-[color:var(--foundation-grey-dark)]"
          >
            <div className="flex items-center gap-3">
              <img src={p.logo} alt="" width={28} height={28} />
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[color:var(--foundation-white-light)]">{p.title}</h3>
                <p className="text-sm text-[color:var(--foundation-white-dark)]">{p.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[color:var(--foundation-white-dark)]">{p.summary}</p>
            {p.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color:var(--surface-border)] bg-[color:var(--foundation-grey-dark)] px-3 py-1 text-xs font-semibold text-[color:var(--foundation-white-dark)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

