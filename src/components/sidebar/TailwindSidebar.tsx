"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContentEntry, ContentKind } from "@/lib/content/types";
import { buildHugoTree, HugoTreeNode } from "@/lib/sidebar/hugoTree";

export function TailwindSidebar({
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
  const baseHref = `/${kind}/`;
  const tree = useMemo(() => buildHugoTree(kind, entries), [entries, kind]);
  const [localSearch, setLocalSearch] = useState("");
  const search = searchValue ?? localSearch;
  const setSearch = onSearchChange ?? setLocalSearch;

  const derivedOpen = useMemo(() => {
    if (!activeHref) return new Set<string>();
    const open = new Set<string>();
    const walk = (nodes: HugoTreeNode[]) => {
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
    <aside className="hidden lg:block">
      <div className="sticky top-20">
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
        />
      </div>
    </aside>
  );
}

export function TailwindSidebarContent({
  baseHref,
  title,
  search,
  onSearchChange,
  tree,
  activeHref,
  openFolders,
  onToggle,
  onNavigate,
}: {
  baseHref: string;
  title: string;
  search: string;
  onSearchChange: (v: string) => void;
  tree: HugoTreeNode[];
  activeHref: string | null;
  openFolders: Set<string>;
  onToggle: (key: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
      <div className="flex items-center justify-between gap-3">
        <Link href={baseHref} className="font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search..."
        className="mt-3 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:bg-black dark:focus:border-neutral-600"
      />

      <nav className="mt-4" aria-label={`${title} sidebar`}>
        <ul className="flex flex-col gap-1">
          {tree.map((n) => (
            <TreeItem
              key={n.key}
              node={n}
              activeHref={activeHref}
              openFolders={openFolders}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}

function TreeItem({
  node,
  activeHref,
  openFolders,
  onToggle,
  onNavigate,
}: {
  node: HugoTreeNode;
  activeHref: string | null;
  openFolders: Set<string>;
  onToggle: (key: string) => void;
  onNavigate?: () => void;
}) {
  if (node.type === "leaf") {
    const isActive = !!activeHref && activeHref === node.href;
    return (
      <li>
        <Link
          href={node.href}
          onClick={onNavigate}
          className={`block rounded-md px-2 py-1 transition-colors ${
            isActive
              ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
          }`}
        >
          {node.label}
        </Link>
      </li>
    );
  }

  const isOpen = openFolders.has(node.key);
  const isActive = !!activeHref && activeHref.startsWith(node.href);

  return (
    <li className="flex flex-col">
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          aria-label={isOpen ? "Collapse" : "Expand"}
          onClick={() => onToggle(node.key)}
        >
          {isOpen ? "−" : "+"}
        </button>
        <Link
          href={node.href}
          onClick={onNavigate}
          className={`min-w-0 flex-1 truncate rounded-md px-2 py-1 transition-colors ${
            isActive
              ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
          }`}
        >
          {node.label}
        </Link>
      </div>
      {isOpen ? (
        <ul className="mt-1 flex flex-col gap-1 pl-6">
          {node.children.map((c) => (
            <TreeItem
              key={c.key}
              node={c}
              activeHref={activeHref}
              openFolders={openFolders}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
