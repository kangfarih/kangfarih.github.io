"use client";

import { useEffect, useMemo, useState } from "react";
import { ContentEntry, ContentKind } from "@/lib/content/types";
import { buildHugoTree } from "@/lib/sidebar/hugoTree";
import { TailwindSidebar, TailwindSidebarContent } from "@/components/sidebar/TailwindSidebar";

export function ResponsiveSidebar({
  kind,
  entries,
  activeHref,
  title,
  searchValue,
  onSearchChange,
}: {
  kind: ContentKind;
  entries: ContentEntry[];
  activeHref: string | null;
  title: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const baseHref = `/${kind}/`;
  const tree = useMemo(() => buildHugoTree(kind, entries), [entries, kind]);

  const [localSearch, setLocalSearch] = useState("");
  const search = searchValue ?? localSearch;
  const setSearch = onSearchChange ?? setLocalSearch;

  const derivedOpen = useMemo(() => {
    if (!activeHref) return new Set<string>();
    const open = new Set<string>();
    const walk = (nodes: ReturnType<typeof buildHugoTree>) => {
      for (const n of nodes) {
        if (n.type !== "folder") continue;
        if (activeHref.startsWith(n.href)) open.add(n.key);
        walk(n.children);
      }
    };
    walk(tree);
    return open;
  }, [activeHref, tree]);

  const [openFolders, setOpenFolders] = useState<Set<string>>(derivedOpen);
  useEffect(() => setOpenFolders(derivedOpen), [derivedOpen]);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
        {open ? (
          <div className="fixed inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close sidebar"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[85vw] max-w-[320px] overflow-y-auto bg-white p-4 dark:bg-black">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{title}</p>
                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="mt-3">
                <TailwindSidebarContent
                  baseHref={baseHref}
                  title={title}
                  search={search}
                  onSearchChange={setSearch}
                  tree={tree}
                  activeHref={activeHref}
                  openFolders={openFolders}
                  onToggle={(k) =>
                    setOpenFolders((prev) => {
                      const next = new Set(prev);
                      if (next.has(k)) next.delete(k);
                      else next.add(k);
                      return next;
                    })
                  }
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <TailwindSidebar
        kind={kind}
        entries={entries}
        activeHref={activeHref}
        title={title}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />
    </>
  );
}
