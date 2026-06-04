import { ContentEntry, ContentKind } from "@/lib/content/types";

export type HugoTreeNode =
  | { type: "folder"; key: string; label: string; href: string; children: HugoTreeNode[] }
  | { type: "leaf"; key: string; label: string; href: string };

type FolderNode = {
  label: string;
  href: string;
  children: Map<string, FolderNode>;
  leaves: ContentEntry[];
};

export function buildHugoTree(kind: ContentKind, entries: ContentEntry[]): HugoTreeNode[] {
  const root: FolderNode = { label: "", href: `/${kind}/`, children: new Map(), leaves: [] };

  for (const e of entries) {
    if (e.kind !== kind) continue;
    if (e.slug.length === 0) continue;

    let cur = root;
    for (let i = 0; i < e.slug.length - 1; i++) {
      const seg = e.slug[i];
      const existing = cur.children.get(seg);
      if (existing) {
        cur = existing;
        continue;
      }
      const href = `/${kind}/${e.slug.slice(0, i + 1).join("/")}/`;
      const node: FolderNode = { label: humanizeSegment(seg), href, children: new Map(), leaves: [] };
      cur.children.set(seg, node);
      cur = node;
    }
    cur.leaves.push(e);
  }

  return folderToNodes(root);
}

function folderToNodes(folder: FolderNode): HugoTreeNode[] {
  const nodes: HugoTreeNode[] = [];

  for (const leaf of folder.leaves.sort((a, b) => a.title.localeCompare(b.title))) {
    nodes.push({ type: "leaf", key: leaf.href, label: leaf.title, href: leaf.href });
  }

  const folders = Array.from(folder.children.values()).sort((a, b) => a.label.localeCompare(b.label));
  for (const f of folders) {
    nodes.push({ type: "folder", key: f.href, label: f.label, href: f.href, children: folderToNodes(f) });
  }

  return nodes;
}

function humanizeSegment(seg: string) {
  return seg
    .split("-")
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(" ");
}

