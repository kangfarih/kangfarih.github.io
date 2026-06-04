import { PortfoliosDetailPage } from "@/components/portfolios/PortfoliosDetailPage";
import { PortfoliosListPage } from "@/components/portfolios/PortfoliosListPage";
import { getEntrySource, hasEntry, listEntries } from "@/lib/content/fs";
import { renderMdx } from "@/lib/content/mdx";
import { extractTocFromMdx } from "@/lib/content/toc";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const entries = await listEntries("portfolios");
  const params: { slug: string[] }[] = [];
  const prefixes = new Set<string>();

  for (const e of entries) {
    params.push({ slug: e.slug });
    for (let i = 1; i < e.slug.length; i++) {
      prefixes.add(e.slug.slice(0, i).join("/"));
    }
  }

  for (const p of prefixes) {
    params.push({ slug: p.split("/").filter(Boolean) });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (await hasEntry("portfolios", slug)) {
    const source = await getEntrySource("portfolios", slug);
    const title = source.frontmatter.title;
    const description = source.frontmatter.summary;
    const hero = source.frontmatter.hero;
    return {
      title,
      description,
      openGraph: hero ? { title, description, images: [hero] } : { title, description },
      twitter: hero ? { card: "summary_large_image", title, description, images: [hero] } : { card: "summary", title, description },
    };
  }
  return {
    title: slug.length ? `${humanizeSlug(slug)} | Portfolios` : "Portfolios",
    description: "Portfolio list.",
  };
}

function humanizeSlug(slug: string[]) {
  return slug
    .map((s) =>
      s
        .split("-")
        .filter(Boolean)
        .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
        .join(" ")
    )
    .join(" / ");
}

export default async function PortfoliosSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (await hasEntry("portfolios", slug)) {
    const entries = await listEntries("portfolios");
    const source = await getEntrySource("portfolios", slug);
    const toc = extractTocFromMdx(source.source);
    const content = await renderMdx(source.source);
    const entry = entries.find((e) => e.href === `/portfolios/${slug.join("/")}/`) ?? {
      kind: "portfolios" as const,
      slug,
      href: `/portfolios/${slug.join("/")}/`,
      title: source.frontmatter.title,
      date: source.frontmatter.date,
      summary: source.frontmatter.summary,
      hero: source.frontmatter.hero,
    };

    return <PortfoliosDetailPage entry={entry} content={content} sidebarEntries={entries} toc={toc} />;
  }

  const allEntries = await listEntries("portfolios");
  const visibleEntries = await listEntries("portfolios", slug);
  const activeHref = `/portfolios/${slug.join("/")}/`;
  return <PortfoliosListPage allEntries={allEntries} visibleEntries={visibleEntries} activeHref={activeHref} />;
}
