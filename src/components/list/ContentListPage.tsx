"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ContentEntry, ContentKind } from "@/lib/content/types";
import { formatDate } from "@/lib/formatDate";

export function ContentListPage({
  kind,
  entries,
}: {
  kind: ContentKind;
  entries: ContentEntry[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => `${e.title} ${e.summary ?? ""}`.toLowerCase().includes(q));
  }, [entries, query]);

  const tree = useMemo(() => buildFolderTree(entries), [entries]);

  return (
    <div className="container-fluid bg-dimmed wrapper list-wrapper">
      <section className="sidebar-section sidebar-section-flex d-none d-md-block" id="sidebar-section">
        <Sidebar kind={kind} tree={tree} query={query} onQueryChange={setQuery} />
      </section>
      <section className="content-section" id="content-section">
        <div className="content">
          <div className="container-fluid content-cards">
            <div className="post-card-holder" id="post-card-holder">
              {visible.map((e) => (
                <div className="pt-2 post-card" key={e.href}>
                  <Link href={e.href} className="post-card-link">
                    <div className="card">
                      <div className="card-head">
                        {e.hero ? <img className="card-img-top" src={e.hero} alt="Card image cap" /> : null}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{e.title}</h5>
                        {e.summary ? <p className="card-text post-summary">{e.summary}</p> : null}
                      </div>
                      <div className="card-footer">
                        <span className="float-left">{formatDate(e.date)}</span>
                        <span className="float-right btn btn-outline-info btn-sm">Read</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {visible.length === 0 ? (
                <div className="pt-4">
                  <div className="alert alert-secondary" role="alert">
                    No items found.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sidebar({
  kind,
  tree,
  query,
  onQueryChange,
}: {
  kind: ContentKind;
  tree: FolderNode[];
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <div className="sidebar-holder">
      <div className="sidebar-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{kind === "posts" ? "Posts" : "Portfolios"}</h5>
      </div>
      <div className="search-box pl-2 pr-2 pt-2">
        <input
          className="form-control"
          placeholder="Search..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <div className="sidebar-body">
        <ul className="tree" id="tree">
          <li>
            <Link className="tree-link" href={`/${kind}/`}>
              All
            </Link>
          </li>
          <TreeNodes kind={kind} nodes={tree} />
        </ul>
      </div>
    </div>
  );
}

type FolderNode = {
  name: string;
  path: string[];
  children: FolderNode[];
};

function buildFolderTree(entries: ContentEntry[]): FolderNode[] {
  const root: FolderNode[] = [];

  const upsertChild = (children: FolderNode[], part: string, pathParts: string[]) => {
    const existing = children.find((c) => c.name === part);
    if (existing) return existing;
    const node: FolderNode = { name: part, path: pathParts, children: [] };
    children.push(node);
    children.sort((a, b) => a.name.localeCompare(b.name));
    return node;
  };

  for (const e of entries) {
    const parts = e.slug.slice(0, -1);
    let children = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const pathParts = parts.slice(0, i + 1);
      const node = upsertChild(children, part, pathParts);
      children = node.children;
    }
  }

  return root;
}

function TreeNodes({
  kind,
  nodes,
}: {
  kind: ContentKind;
  nodes: FolderNode[];
}) {
  return (
    <>
      {nodes.map((n) => (
        <li key={n.path.join("/")}>
          <Link className="tree-link" href={`/${kind}/${n.path.join("/")}/`}>
            {n.name}
          </Link>
          {n.children.length > 0 ? (
            <ul>
              <TreeNodes kind={kind} nodes={n.children} />
            </ul>
          ) : null}
        </li>
      ))}
    </>
  );
}
