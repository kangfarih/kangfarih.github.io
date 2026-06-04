const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const cheerio = require("cheerio");
const TurndownService = require("turndown");

const repoRoot = path.join(__dirname, "..");
const hugoPublicDir = path.join(repoRoot, "hugo-public");

const outProfileJson = path.join(repoRoot, "src", "content", "profile.json");
const outPostsDir = path.join(repoRoot, "src", "content", "posts");
const outPortfoliosDir = path.join(repoRoot, "src", "content", "portfolios");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  await ensureDir(path.dirname(outProfileJson));
  await ensureDir(outPostsDir);
  await ensureDir(outPortfoliosDir);

  const turndown = new TurndownService({
    codeBlockStyle: "fenced",
    headingStyle: "atx",
    emDelimiter: "_",
  });
  turndown.addRule("keep-iframe", {
    filter: ["iframe"],
    replacement: (_, node) => {
      const src = decodeHtmlEntities(node.getAttribute("src") || "");
      const title = decodeHtmlEntities(node.getAttribute("title") || "");
      if (!src) return "";
      return `\n\n<ResponsiveIframe src=${JSON.stringify(src)} title=${JSON.stringify(title)} />\n\n`;
    },
  });
  turndown.addRule("keep-video", {
    filter: ["video", "source"],
    replacement: (_, node) => `\n\n${node.outerHTML}\n\n`,
  });

  const profile = await extractProfile({ turndown });
  await fsp.writeFile(outProfileJson, JSON.stringify(profile, null, 2) + "\n", "utf8");

  const postsIndex = await extractIndexCards({
    htmlPath: path.join(hugoPublicDir, "posts", "index.html"),
    cardSelector: "#post-card-holder .post-card",
    linkSelector: "a.post-card-link",
    titleSelector: ".card-title",
    summarySelector: ".post-summary",
    dateSelector: ".card-footer span.float-left",
    imgSelector: "img.card-img-top",
  });

  const portfoliosIndex = await extractIndexCards({
    htmlPath: path.join(hugoPublicDir, "portfolios", "index.html"),
    cardSelector: "#post-card-holder .post-card",
    linkSelector: "a.post-card-link",
    titleSelector: ".card-title",
    summarySelector: ".post-summary",
    dateSelector: ".card-footer span.float-left",
    imgSelector: "img.card-img-top",
  });

  await importLeafPages({
    baseDir: path.join(hugoPublicDir, "posts"),
    routePrefix: "/posts",
    outDir: outPostsDir,
    turndown,
    indexMetaByHref: postsIndex,
  });

  await importLeafPages({
    baseDir: path.join(hugoPublicDir, "portfolios"),
    routePrefix: "/portfolios",
    outDir: outPortfoliosDir,
    turndown,
    indexMetaByHref: portfoliosIndex,
  });
}

async function extractProfile({ turndown }) {
  const html = await fsp.readFile(path.join(hugoPublicDir, "index.html"), "utf8");
  const $ = cheerio.load(html);

  const greeting = $(".home .greeting").first().text().trim();
  const homeStyle = $("#home").find("style").first().text() || "";
  const homeBackgroundRules = extractHomeBackgroundRules(homeStyle);
  const authorImage = normalizeAssetUrl($("#home").find("img").first().attr("src") || "");
  const lastUpdate = $("footer .col-12.text-center").last().text().replace(/\s+/g, " ").trim();
  const taglines = $("#typing-carousel-data")
    .find("li")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter(Boolean);

  const aboutSection = $("#about").first();
  const name = aboutSection.find("h3").first().text().trim();
  const designation = aboutSection.find("h5").first().text().trim();

  const aboutHtml = aboutSection.find("p").first().html() ?? "";
  const aboutMarkdown = turndown.turndown(aboutHtml).trim();

  const resumeUrl = aboutSection.find('a:has(button:contains("My resume"))').attr("href") || "";

  const socials = aboutSection
    .find("ul.social-link a")
    .toArray()
    .map((el) => {
      const href = $(el).attr("href") || "";
      const icon = $(el).find("i").attr("class") || "";
      return { href, icon };
    })
    .filter((s) => s.href.length > 0);

  const softSkills = aboutSection
    .find(".circular-progress")
    .toArray()
    .map((el) => {
      const root = $(el);
      const color = (root.attr("class") || "").split(/\s+/).filter(Boolean).filter((c) => c !== "circular-progress")[0] || "";
      const name = root.find(".circular-progress-value").text().trim();
      const pctClass =
        root
          .find(".circular-progress-percentage-100, .circular-progress-percentage-95, .circular-progress-percentage-90, .circular-progress-percentage-85, .circular-progress-percentage-80, .circular-progress-percentage-75, .circular-progress-percentage-70, .circular-progress-percentage-65, .circular-progress-percentage-60, .circular-progress-percentage-55, .circular-progress-percentage-50")
          .attr("class") || "";
      const match = pctClass.match(/circular-progress-percentage-(\d+)/);
      const percentage = match ? Number(match[1]) : undefined;
      return { name, percentage, color };
    })
    .filter((s) => s.name.length > 0);

  const skills = $("#skills")
    .find("#primary-skills .card")
    .toArray()
    .map((el) => {
      const card = $(el);
      const name = card.find(".card-title").first().text().trim();
      const logo = card.find("img").first().attr("src") || "";
      const url = card.closest("a").attr("href") || "";
      const summaryHtml = card.find(".card-text").first().html() ?? "";
      const summary = turndown.turndown(summaryHtml).trim();
      return { name, logo, url, summary };
    })
    .filter((s) => s.name.length > 0);

  const experiences = $("#experiences")
    .find(".experience-entry-heading")
    .toArray()
    .map((el) => {
      const heading = $(el);
      const col = heading.parent();
      const role = heading.find("h5").first().text().trim();
      const companyEl = heading.find("h6 a").first();
      const company = companyEl.text().trim() || heading.find("h6").first().text().trim();
      const companyUrl = companyEl.attr("href") || "";
      const meta = heading.find("p").first().text().replace(/\s+/g, " ").trim();
      const summary = (col.children("p").first().text() || "").replace(/\s+/g, " ").trim();
      const responsibilities = col
        .find("ul li")
        .toArray()
        .map((li) => $(li).text().trim())
        .filter(Boolean);
      return { role, company, companyUrl, meta, summary, responsibilities };
    })
    .filter((e) => e.role.length > 0 && e.company.length > 0);

  const projectFilters = $("#projects")
    .find("#project-filter-buttons button")
    .toArray()
    .map((el) => {
      const name = $(el).text().trim();
      const filter = $(el).attr("data-filter") || "";
      return { name, filter };
    })
    .filter((b) => b.name.length > 0 && b.filter.length > 0);

  const projects = $("#projects")
    .find("#project-card-holder .filtr-item")
    .toArray()
    .map((el) => {
      const item = $(el);
      const categories = (item.attr("data-category") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((c) => c !== "all");
      const card = item.find(".card").first();
      const headerLink = card.find("a.card-header").first();
      const url = headerLink.attr("href") || "";
      const title = headerLink.find(".card-title").first().text().trim();
      const logo = headerLink.find("img").first().attr("src") || "";
      const role = headerLink.find(".sub-title span").first().text().trim();
      const timeline = headerLink.find(".sub-title span").last().text().trim();
      const summary = (card.find(".card-body p").first().text() || "").replace(/\s+/g, " ").trim();
      const repo = card.find("a.github-button-inactive, a.github-button").first().attr("href") || "";
      return { title, logo, role, timeline, url, repo, tags: categories, summary };
    })
    .filter((p) => p.title.length > 0);

  const recentPosts = $("#recent-posts")
    .find("#recent-post-cards .post-card")
    .toArray()
    .map((el) => {
      const card = $(el);
      const url = card.find("a.post-card-link").first().attr("href") || "";
      const title = card.find(".card-title").first().text().trim();
      const summary = (card.find(".post-summary").first().text() || "").replace(/\s+/g, " ").trim();
      const date = card.find(".card-footer span.float-left").first().text().trim();
      const hero = card.find(".card-img-top").first().attr("src") || "";
      return { title, summary, date, url, hero };
    })
    .filter((p) => p.title.length > 0 && p.url.length > 0);

  return {
    greeting,
    name,
    designation,
    homeBackgroundRules,
    authorImage,
    lastUpdate,
    taglines,
    aboutMarkdown,
    resumeUrl,
    socials,
    softSkills,
    skills,
    experiences,
    projectFilters,
    projects,
    recentPosts,
  };
}

async function extractIndexCards({
  htmlPath,
  cardSelector,
  linkSelector,
  titleSelector,
  summarySelector,
  dateSelector,
  imgSelector,
}) {
  const html = await fsp.readFile(htmlPath, "utf8");
  const $ = cheerio.load(html);
  const map = new Map();

  $(cardSelector).each((_, el) => {
    const card = $(el);
    const href = card.find(linkSelector).first().attr("href") || "";
    if (!href) return;
    const title = card.find(titleSelector).first().text().trim();
    const summary = decodeHtmlEntities((card.find(summarySelector).first().text() || "").replace(/\s+/g, " ").trim());
    const date = card.find(dateSelector).first().text().trim();
    const hero = card.find(imgSelector).first().attr("src") || "";
    map.set(normalizeHref(href), { title, summary, date, hero });
  });

  return map;
}

async function importLeafPages({ baseDir, routePrefix, outDir, turndown, indexMetaByHref }) {
  const leafHtmlFiles = await walkFiles(baseDir, (p) => p.endsWith("index.html"));

  for (const htmlPath of leafHtmlFiles) {
    const rel = path.relative(hugoPublicDir, htmlPath).replaceAll(path.sep, "/");
    const route = "/" + rel.replace(/\/index\.html$/, "");
    if (route === routePrefix) continue;
    if (route.includes("/page/")) continue;

    const html = await fsp.readFile(htmlPath, "utf8");
    const $ = cheerio.load(html);
    const hasContent = $("#post-content").length > 0 || $(".post-content").length > 0;
    if (!hasContent) continue;

    const segments = route.replace(routePrefix, "").split("/").filter(Boolean);
    if (segments.length === 0) continue;

    const title = $(".title h1").first().text().trim() || $("title").first().text().trim();
    const dateText = $(".author-profile p").first().text().trim();

    const contentHtml = $("#post-content").first().html() ?? $(".post-content").first().html() ?? "";
    const contentMdx = turndown.turndown(contentHtml).trim();

    const href = normalizeHref(route.endsWith("/") ? route : route + "/");
    const indexMeta = indexMetaByHref.get(href) || indexMetaByHref.get(normalizeHref(route + "/")) || undefined;

    const summary = (indexMeta?.summary || "").trim();
    const hero = (indexMeta?.hero || "").trim() || inferHero({ routePrefix, segments });

    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      dateText ? `date: ${yamlString(dateText)}` : null,
      summary ? `summary: ${yamlString(summary)}` : null,
      hero ? `hero: ${yamlString(hero)}` : null,
      "---",
      "",
    ]
      .filter((l) => l != null)
      .join("\n");

    const outPath = path.join(outDir, ...segments) + ".mdx";
    await ensureDir(path.dirname(outPath));
    await fsp.writeFile(outPath, frontmatter + contentMdx + "\n", "utf8");
  }
}

function inferHero({ routePrefix, segments }) {
  const base = `${routePrefix}/${segments.join("/")}`;
  const publicDir = path.join(repoRoot, "public", ...segments);
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const p = path.join(repoRoot, "public", routePrefix.replace(/^\//, ""), ...segments, `hero.${ext}`);
    if (fs.existsSync(p)) return `${base}/hero.${ext}`;
  }
  if (fs.existsSync(publicDir)) {
    const entries = fs.readdirSync(publicDir);
    const match = entries.find((f) => /^hero\./.test(f));
    if (match) return `${base}/${match}`;
  }
  return "";
}

function normalizeHref(href) {
  if (!href.startsWith("/")) return href;
  return href.endsWith("/") ? href : href + "/";
}

async function walkFiles(dir, predicate) {
  const out = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(full, predicate)));
      continue;
    }
    if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function yamlString(value) {
  const v = String(value).replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  return JSON.stringify(v);
}

function extractHomeBackgroundRules(cssText) {
  const rules = [];
  const defaultMatch = cssText.match(/#homePageBackgroundImageDivStyled\{background-image:url\(([^)]+)\)\}/i);
  if (defaultMatch) {
    rules.push({ media: null, url: normalizeAssetUrl(stripQuotes(defaultMatch[1])) });
  }

  const mediaRegex = /@media([^{]+)\{#homePageBackgroundImageDivStyled\{background-image:url\(([^)]+)\)\}\}/gi;
  let m;
  while ((m = mediaRegex.exec(cssText)) != null) {
    rules.push({ media: m[1].trim(), url: normalizeAssetUrl(stripQuotes(m[2])) });
  }

  return rules;
}

function stripQuotes(value) {
  return String(value).trim().replace(/^['"]|['"]$/g, "");
}

function normalizeAssetUrl(url) {
  return String(url)
    .replace(/^https?:\/\/[^/]+/i, "")
    .trim();
}

function decodeHtmlEntities(text) {
  return String(text)
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&lsquo;", "'")
    .replaceAll("&rdquo;", '"')
    .replaceAll("&ldquo;", '"')
    .replaceAll("&ndash;", "–")
    .replaceAll("&mdash;", "—");
}
