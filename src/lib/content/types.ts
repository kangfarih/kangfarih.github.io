export type ContentKind = "posts" | "portfolios";

export type ContentSlug = string[];

export type ContentFrontmatter = {
  title: string;
  date?: string;
  summary?: string;
  hero?: string;
};

export type ContentEntry = ContentFrontmatter & {
  kind: ContentKind;
  slug: ContentSlug;
  href: string;
};

