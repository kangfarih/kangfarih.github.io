export type TocItem = {
  depth: number;
  id: string;
  text: string;
};

export function extractTocFromMdx(source: string): TocItem[] {
  const lines = source.split("\n");
  const items: TocItem[] = [];

  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2].replace(/`/g, "").trim();
    if (!text) continue;
    items.push({ depth, text, id: slugify(text) });
  }

  return dedupeIds(items);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function dedupeIds(items: TocItem[]) {
  const seen = new Map<string, number>();
  return items.map((i) => {
    const count = seen.get(i.id) ?? 0;
    seen.set(i.id, count + 1);
    if (count === 0) return i;
    return { ...i, id: `${i.id}-${count}` };
  });
}

