"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContentEntry } from "@/lib/content/types";
import { formatDate } from "@/lib/formatDate";
import { ResponsiveSidebar } from "@/components/sidebar/ResponsiveSidebar";

type PostsSearchIndex = {
  version: string;
  generatedAt: string;
  items: {
    href: string;
    title: string;
    summary: string;
    date?: string;
    hero?: string;
    bodyText: string;
  }[];
};

export function PostsListPage({
  allEntries,
  visibleEntries,
  activeHref,
}: {
  allEntries: ContentEntry[];
  visibleEntries: ContentEntry[];
  activeHref: string | null;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<PostsSearchIndex | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    if (index) return;
    let alive = true;
    fetch("/search/posts.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive) return;
        if (data && typeof data === "object") setIndex(data as PostsSearchIndex);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [index, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visibleEntries;
    if (!index) {
      return visibleEntries.filter((e) => {
        const hay = `${e.title} ${e.summary ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }
    const matches = new Set(
      index.items
        .filter((it) => `${it.title} ${it.summary} ${it.bodyText}`.toLowerCase().includes(q))
        .map((it) => it.href)
    );
    return visibleEntries.filter((e) => matches.has(e.href));
  }, [index, query, visibleEntries]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
      <ResponsiveSidebar kind="posts" entries={allEntries} activeHref={activeHref} title="Posts" searchValue={query} onSearchChange={setQuery} />

      <section className="flex flex-col gap-6">
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          {activeHref ? <p className="text-sm text-neutral-500 dark:text-neutral-400">{activeHref}</p> : null}
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" id="post-card-holder">
          {filtered.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-xl border border-neutral-200 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              {e.hero ? (
                <img
                  src={e.hero}
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[16/9] w-full rounded-lg bg-neutral-100 dark:bg-neutral-800" />
              )}
              <div className="mt-3">
                <h2 className="font-medium group-hover:underline">{e.title}</h2>
                {e.summary ? <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{e.summary}</p> : null}
                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{formatDate(e.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        {query.trim() && index && filtered.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-200">
            No items found.
          </div>
        ) : null}
      </section>
    </div>
  );
}
