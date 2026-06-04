import { PostsDetailPage } from "@/components/posts/PostsDetailPage";
import { PostsListPage } from "@/components/posts/PostsListPage";
import { getEntrySource, hasEntry, listEntries } from "@/lib/content/fs";
import { renderMdx } from "@/lib/content/mdx";
import { extractTocFromMdx } from "@/lib/content/toc";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const entries = await listEntries("posts");
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
  if (await hasEntry("posts", slug)) {
    const source = await getEntrySource("posts", slug);
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
    title: slug.length ? `${humanizeSlug(slug)} | Posts` : "Posts",
    description: "Post list.",
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

export default async function PostsSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (await hasEntry("posts", slug)) {
    const entries = await listEntries("posts");
    const source = await getEntrySource("posts", slug);
    const toc = extractTocFromMdx(source.source);
    const content = await renderMdx(source.source);
    const entry = entries.find((e) => e.href === `/posts/${slug.join("/")}/`) ?? {
      kind: "posts" as const,
      slug,
      href: `/posts/${slug.join("/")}/`,
      title: source.frontmatter.title,
      date: source.frontmatter.date,
      summary: source.frontmatter.summary,
      hero: source.frontmatter.hero,
    };

    return <PostsDetailPage entry={entry} content={content} sidebarEntries={entries} toc={toc} />;
  }

  const allEntries = await listEntries("posts");
  const visibleEntries = await listEntries("posts", slug);
  const activeHref = `/posts/${slug.join("/")}/`;
  return <PostsListPage allEntries={allEntries} visibleEntries={visibleEntries} activeHref={activeHref} />;
}
