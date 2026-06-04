const fs = require("node:fs/promises");
const path = require("node:path");
const matter = require("gray-matter");

const repoRoot = path.join(__dirname, "..");
const inDir = path.join(repoRoot, "src", "content", "portfolios");
const outFile = path.join(repoRoot, "public", "search", "portfolios.json");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const files = await walkFiles(inDir);
  const items = [];

  for (const filePath of files) {
    if (!filePath.endsWith(".mdx")) continue;
    const rel = path.relative(inDir, filePath).replaceAll(path.sep, "/");
    const slug = rel.replace(/\.mdx$/, "").split("/").filter(Boolean);
    const href = `/portfolios/${slug.join("/")}/`;

    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data || {};
    const bodyText = toPlainText(parsed.content || "");

    items.push({
      href,
      title: String(fm.title || slug[slug.length - 1] || "").trim(),
      summary: String(fm.summary || "").trim(),
      date: fm.date ? String(fm.date) : undefined,
      hero: fm.hero ? String(fm.hero) : undefined,
      bodyText,
    });
  }

  items.sort((a, b) => a.title.localeCompare(b.title));

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(
    outFile,
    JSON.stringify(
      {
        version: "1",
        generatedAt: new Date().toISOString(),
        items,
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

async function walkFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkFiles(p)));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function toPlainText(src) {
  let s = String(src);
  s = s.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/<[^>]*>/g, " ");
  s = s.replace(/!\[[^\]]*]\([^)]+\)/g, " ");
  s = s.replace(/\[[^\]]*]\(([^)]+)\)/g, " ");
  s = s.replace(/[`*_>#=-]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

