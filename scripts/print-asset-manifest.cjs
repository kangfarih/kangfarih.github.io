const fs = require("node:fs/promises");
const path = require("node:path");
const matter = require("gray-matter");

const repoRoot = path.join(__dirname, "..");
const publicDir = path.join(repoRoot, "public");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const assets = new Map(); // url -> Set(sources)

  const profilePath = path.join(repoRoot, "src", "content", "profile.json");
  const profile = JSON.parse(await fs.readFile(profilePath, "utf8"));
  collectFromObject("profile.json", profile, assets);

  await collectFromMdxDir(path.join(repoRoot, "src", "content", "portfolios"), "portfolios", assets);
  await collectFromMdxDir(path.join(repoRoot, "src", "content", "posts"), "posts", assets);

  const entries = Array.from(assets.entries())
    .map(([url, sources]) => ({ url, sources: Array.from(sources).sort(), exists: urlExists(url) }))
    .sort((a, b) => a.url.localeCompare(b.url));

  const missing = entries.filter((e) => e.url.startsWith("/") && !e.url.startsWith("//") && !e.exists);

  const outLines = [];
  outLines.push(`# Asset Manifest`);
  outLines.push(``);
  outLines.push(`Generated from: profile.json + portfolios/posts MDX frontmatter + MDX bodies.`);
  outLines.push(``);
  outLines.push(`- Total asset refs: ${entries.length}`);
  outLines.push(`- Missing local assets: ${missing.length}`);
  outLines.push(``);

  outLines.push(`## Missing Local Assets`);
  if (missing.length === 0) {
    outLines.push(`- None`);
  } else {
    for (const e of missing) {
      outLines.push(`- ${e.url} (from: ${e.sources.join(", ")})`);
    }
  }
  outLines.push(``);

  outLines.push(`## All Asset References`);
  outLines.push(`| URL | Exists (public/) | Sources |`);
  outLines.push(`|---|---:|---|`);
  for (const e of entries) {
    outLines.push(`| ${escapeCell(e.url)} | ${e.exists ? "Yes" : "No"} | ${escapeCell(e.sources.join(", "))} |`);
  }
  outLines.push(``);

  const outPath = path.join(repoRoot, "ASSET_MANIFEST.md");
  await fs.writeFile(outPath, outLines.join("\n"), "utf8");
}

async function collectFromMdxDir(rootDir, label, assets) {
  const files = await walk(rootDir);
  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const rel = path.relative(rootDir, filePath).replaceAll(path.sep, "/");
    const source = `${label}:${rel}`;
    collectFromObject(`${source}:frontmatter`, parsed.data || {}, assets);
    collectFromText(`${source}:body`, String(parsed.content || ""), assets);
  }
}

function collectFromObject(source, obj, assets) {
  if (obj == null) return;
  if (typeof obj === "string") {
    collectFromText(source, obj, assets);
    return;
  }
  if (Array.isArray(obj)) {
    for (const v of obj) collectFromObject(source, v, assets);
    return;
  }
  if (typeof obj !== "object") return;
  for (const v of Object.values(obj)) collectFromObject(source, v, assets);
}

function collectFromText(source, text, assets) {
  const s = String(text || "");

  const urlLike = [];
  for (const m of s.matchAll(/https?:\/\/[^\s)"']+/g)) urlLike.push(m[0]);
  for (const m of s.matchAll(/(?:^|[\s(])((?:\/(images|posts|portfolios)\/)[^\s)"']+)/g)) urlLike.push(m[1]);

  for (const u of urlLike) {
    const url = normalizeUrl(u);
    if (!url) continue;
    if (!assets.has(url)) assets.set(url, new Set());
    assets.get(url).add(source);
  }
}

function normalizeUrl(u) {
  const url = String(u || "").trim();
  if (!url) return null;
  return url;
}

function urlExists(url) {
  if (!url.startsWith("/") || url.startsWith("//")) return true;
  const rel = url.split("?")[0].replace(/^\/+/, "");
  const full = path.join(publicDir, rel);
  try {
    require("node:fs").accessSync(full);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    if (e.isFile() && p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function escapeCell(s) {
  return String(s ?? "").replaceAll("|", "\\|").replaceAll("\n", " ").trim();
}

