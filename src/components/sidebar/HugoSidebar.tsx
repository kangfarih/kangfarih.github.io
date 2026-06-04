"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ContentEntry, ContentKind } from "@/lib/content/types";
import { buildHugoTree, HugoTreeNode } from "@/lib/sidebar/hugoTree";

export function HugoSidebar({
  kind,
  entries,
  activeHref,
  searchValue,
  onSearchChange,
}: {
  kind: ContentKind;
  entries: ContentEntry[];
  activeHref: string | null;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}) {
  const baseHref = `/${kind}/`;
  const title = kind === "posts" ? "Posts" : "Portfolios";
  const tree = useMemo(() => buildHugoTree(kind, entries), [entries, kind]);
  const [localSearch, setLocalSearch] = useState("");
  const search = searchValue ?? localSearch;
  const setSearch = onSearchChange ?? setLocalSearch;

  const derivedOpen = useMemo(() => {
    if (!activeHref) return new Set<string>();
    const open = new Set<string>();
    const walk = (nodes: HugoTreeNode[]) => {
      for (const n of nodes) {
        if (n.type === "folder") {
          if (activeHref.startsWith(n.href)) open.add(n.key);
          walk(n.children);
        }
      }
    };
    walk(tree);
    return open;
  }, [activeHref, tree]);

  const [openFolders, setOpenFolders] = useState<Set<string>>(derivedOpen);

  useEffect(() => {
    setOpenFolders(derivedOpen);
  }, [derivedOpen]);

  return (
    <div className="sidebar-holder">
      <div className="sidebar" id="sidebar">
        <input
          type="text"
          placeholder="Search"
          data-search
          id="search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="sidebar-tree">
          <ul className="tree" id="tree">
            <li id="list-heading">
              <Link href={baseHref} data-filter="all">
                {title}
              </Link>
            </li>
            <div className="subtree">
              {tree.map((n) => (
                <TreeItem
                  key={n.key}
                  node={n}
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
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TreeItem({
  node,
  activeHref,
  openFolders,
  onToggle,
}: {
  node: HugoTreeNode;
  activeHref: string | null;
  openFolders: Set<string>;
  onToggle: (key: string) => void;
}) {
  if (node.type === "leaf") {
    const isActive = !!activeHref && activeHref === node.href;
    return (
      <li>
        <Link className={isActive ? "active" : undefined} href={node.href}>
          {node.label}
        </Link>
      </li>
    );
  }

  const isOpen = openFolders.has(node.key);
  const isActive = !!activeHref && activeHref.startsWith(node.href);

  return (
    <li>
      <span
        role="button"
        tabIndex={0}
        onClick={() => onToggle(node.key)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onToggle(node.key) : null)}
      >
        {isOpen ? "−" : "+"}
      </span>
      <Link className={isActive ? "active" : undefined} href={node.href}>
        {node.label}
      </Link>
      <ul className={isOpen ? "active" : undefined}>
        {node.children.map((c) => (
          <TreeItem key={c.key} node={c} activeHref={activeHref} openFolders={openFolders} onToggle={onToggle} />
        ))}
      </ul>
    </li>
  );
}
