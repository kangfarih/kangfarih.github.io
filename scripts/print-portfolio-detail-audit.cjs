const fs = require("node:fs/promises");
const path = require("node:path");
const matter = require("gray-matter");

const repoRoot = path.join(__dirname, "..");
const portfoliosDir = path.join(repoRoot, "src", "content", "portfolios");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const files = await walk(portfoliosDir);
  const rows = [];

  for (const filePath of files) {
    const rel = path.relative(portfoliosDir, filePath).replaceAll(path.sep, "/");
    const slug = rel.replace(/\.mdx$/, "").split("/").filter(Boolean);
    const href = `/portfolios/${slug.join("/")}/`;

    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data || {};
    const body = String(parsed.content || "");

    const headings = extractHeadings(body);
    const h2 = headings.filter((h) => h.depth === 2).map((h) => h.text);
    const h3 = headings.filter((h) => h.depth === 3).map((h) => h.text);

    rows.push({
      href,
      title: String(fm.title || "").trim(),
      hero: String(fm.hero || "").trim(),
      h2,
      h3,
      hasResponsiveIframe: /<ResponsiveIframe\b/.test(body),
      hasVideoTag: /<video\b/.test(body),
      hasImageTag: /<img\b/.test(body),
    });
  }

  rows.sort((a, b) => a.href.localeCompare(b.href));

  process.stdout.write("| Href | Title | Section Headings (H3) | Has ResponsiveIframe |\n");
  process.stdout.write("|---|---|---|---|\n");
  for (const r of rows) {
    const sections = r.h3.length ? r.h3.map(escInline).join(", ") : "";
    process.stdout.write(
      `| ${escInline(r.href)} | ${escInline(r.title)} | ${sections} | ${r.hasResponsiveIframe ? "Yes" : "No"} |\n`
    );
  }

  const bySection = new Map();
  for (const r of rows) {
    for (const s of r.h3) bySection.set(s, (bySection.get(s) || 0) + 1);
  }
  const sectionCounts = Array.from(bySection.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  process.stdout.write("\n---\n");
  process.stdout.write("H3 section frequency:\n");
  for (const [name, count] of sectionCounts) {
    process.stdout.write(`- ${name}: ${count}\n`);
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

function extractHeadings(src) {
  const lines = String(src).split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,6})\s+(.*)$/);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2].trim().replace(/\s+/g, " ");
    if (!text) continue;
    out.push({ depth, text });
  }
  return out;
}

function escInline(s) {
  return String(s ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim();
}
