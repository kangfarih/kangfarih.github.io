import Link from "next/link";
import { ReactNode } from "react";
import { ContentEntry, ContentKind } from "@/lib/content/types";
import { formatDate } from "@/lib/formatDate";
import { siteProfile } from "@/content/profile";
import { TocItem } from "@/lib/content/toc";

export function ContentDetailPage({
  kind,
  entry,
  content,
  sidebarEntries,
  toc,
}: {
  kind: ContentKind;
  entry: ContentEntry;
  content: ReactNode;
  sidebarEntries: ContentEntry[];
  toc: TocItem[];
}) {
  const baseHref = `/${kind}/`;

  return (
    <div className="container-fluid bg-dimmed wrapper">
      <section className="sidebar-section sidebar-section-flex" id="sidebar-section">
        <div className="sidebar-holder">
          <div className="sidebar" id="sidebar">
            <input type="text" placeholder="Search" id="search-box" className="form-control" />
            <div className="sidebar-tree">
              <ul className="tree" id="tree">
                <li id="list-heading">
                  <Link href={baseHref}>{kind === "posts" ? "Posts" : "Portfolios"}</Link>
                </li>
                <div className="subtree">
                  {sidebarEntries.map((e) => (
                    <li key={e.href}>
                      <Link className={e.href === entry.href ? "active" : ""} href={e.href}>
                        {e.title}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="content-section" id="content-section">
        <div className="content">
          <div className="container p-0 read-area">
            {entry.hero ? (
              <div className="hero-area col-sm-12" id="hero-area" style={{ backgroundImage: `url(${entry.hero})` }} />
            ) : null}
            <div className="page-content">
              <div className="author-profile ml-auto align-self-lg-center">
                <img className="rounded-circle" src={siteProfile.authorImage} alt="" />
                <h5 className="author-name">{siteProfile.name}</h5>
                <p>{formatDate(entry.date)}</p>
              </div>
              <div className="title">
                <h1>{entry.title}</h1>
              </div>
              <div className="post-content" id="post-content">
                {content}
              </div>
              <hr />
              <div className="row next-prev-navigator" />
              <hr />
            </div>
          </div>
        </div>
      </section>
      <section className="toc-section" id="toc-section">
        <div className="toc-holder">
          <h5 className="text-center pl-3">Table of Contents</h5>
          <hr />
          <div className="toc">
            <nav id="TableOfContents">
              <ul>
                {toc.map((i) => (
                  <li key={i.id} style={{ marginLeft: `${(i.depth - 2) * 14}px` }}>
                    <a href={`#${i.id}`}>{i.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
