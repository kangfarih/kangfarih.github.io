import { ReactNode } from "react";
import { ContentEntry } from "@/lib/content/types";
import { TocItem } from "@/lib/content/toc";
import { siteProfile } from "@/content/profile";
import { formatDate } from "@/lib/formatDate";
import { ResponsiveSidebar } from "@/components/sidebar/ResponsiveSidebar";

export function PortfoliosDetailPage({
  entry,
  content,
  sidebarEntries,
  toc,
}: {
  entry: ContentEntry;
  content: ReactNode;
  sidebarEntries: ContentEntry[];
  toc: TocItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr_280px]">
      <ResponsiveSidebar kind="portfolios" entries={sidebarEntries} activeHref={entry.href} title="Portfolios" />
      <article className="min-w-0">
        {entry.hero ? (
          <img src={entry.hero} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
        ) : null}
        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">{entry.title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
            <img className="rounded-full" src={siteProfile.authorImage} alt="" width={28} height={28} />
            <span>{siteProfile.name}</span>
            <span className="text-neutral-400">·</span>
            <span>{formatDate(entry.date)}</span>
          </div>
        </header>
        <div className="prose prose-neutral dark:prose-invert mt-8" id="post-content">
          {content}
        </div>
      </article>

      {toc.length ? (
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
            <p className="font-medium">Table of contents</p>
            <nav className="mt-3" id="TableOfContents">
              <ul className="flex flex-col gap-2">
                {toc.map((i) => (
                  <li key={i.id} className="leading-snug" style={{ marginLeft: `${(i.depth - 2) * 12}px` }}>
                    <a
                      href={`#${i.id}`}
                      className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                    >
                      {i.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
