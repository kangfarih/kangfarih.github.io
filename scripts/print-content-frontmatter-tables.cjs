const fs = require("node:fs/promises");
const path = require("node:path");
const matter = require("gray-matter");

const repoRoot = path.join(__dirname, "..");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const portfolios = await buildTable("portfolios");
  const posts = await buildTable("posts");

  process.stdout.write("---PORTFOLIOS_COUNT---\n");
  process.stdout.write(String(portfolios.count) + "\n");
  process.stdout.write("---PORTFOLIOS_TABLE---\n");
  process.stdout.write(portfolios.table + "\n");

  process.stdout.write("---POSTS_COUNT---\n");
  process.stdout.write(String(posts.count) + "\n");
  process.stdout.write("---POSTS_TABLE---\n");
  process.stdout.write(posts.table + "\n");
}

async function buildTable(kind) {
  const root = path.join(repoRoot, "src", "content", kind);
  const files = await walk(root);
  const rows = [];

  for (const filePath of files) {
    const rel = path.relative(root, filePath).replaceAll(path.sep, "/");
    const slug = rel.replace(/\.mdx$/, "").split("/").filter(Boolean);
    const href = `/${kind}/${slug.join("/")}/`;
    const raw = await fs.readFile(filePath, "utf8");
    const fm = matter(raw).data || {};
    rows.push({
      href,
      title: String(fm.title || "").trim(),
      date: String(fm.date || "").trim(),
      hero: String(fm.hero || "").trim(),
      summary: String(fm.summary || "").trim(),
    });
  }

  rows.sort((a, b) => a.href.localeCompare(b.href));

  const header = ["Href", "Title", "Date", "Hero", "Summary"];
  const sep = ["---", "---", "---", "---", "---"];
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...rows.map((r) => `| ${esc(r.href)} | ${esc(r.title)} | ${esc(r.date)} | ${esc(r.hero)} | ${trunc(r.summary)} |`),
  ];

  return { count: rows.length, table: lines.join("\n") };
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

function esc(s) {
  return String(s ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim();
}

function trunc(s, n = 120) {
  const v = esc(s);
  return v.length > n ? `${v.slice(0, n - 1)}…` : v;
}

