import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { ContentEntry, ContentFrontmatter, ContentKind, ContentSlug } from "./types";

const contentRoot = path.join(process.cwd(), "src", "content");

export async function listEntries(kind: ContentKind, prefix?: ContentSlug): Promise<ContentEntry[]> {
  const baseDir = path.join(contentRoot, kind);
  const prefixDir = prefix && prefix.length > 0 ? path.join(baseDir, ...prefix) : baseDir;

  const files = await walkMdxFiles(prefixDir);
  const entries: ContentEntry[] = [];

  for (const filePath of files) {
    const rel = path.relative(baseDir, filePath).replaceAll(path.sep, "/");
    const slug = rel.replace(/\.mdx$/, "").split("/").filter(Boolean);
    const fm = await readFrontmatter(filePath);
    entries.push({
      ...fm,
      kind,
      slug,
      href: `/${kind}/${slug.join("/")}/`,
    });
  }

  return entries.sort((a, b) => (parseDate(b.date) ?? 0) - (parseDate(a.date) ?? 0));
}

export async function getEntrySource(kind: ContentKind, slug: ContentSlug) {
  const filePath = path.join(contentRoot, kind, ...slug) + ".mdx";
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  return {
    frontmatter: parsed.data as ContentFrontmatter,
    source: parsed.content,
  };
}

export async function hasEntry(kind: ContentKind, slug: ContentSlug) {
  const filePath = path.join(contentRoot, kind, ...slug) + ".mdx";
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFrontmatter(filePath: string): Promise<ContentFrontmatter> {
  const raw = await readFile(filePath, "utf8");
  const parsed = matter(raw);
  return parsed.data as ContentFrontmatter;
}

async function walkMdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkMdxFiles(full)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      out.push(full);
    }
  }

  return out;
}

function parseDate(date?: string) {
  if (!date) return undefined;
  const t = Date.parse(date);
  return Number.isFinite(t) ? t : undefined;
}

