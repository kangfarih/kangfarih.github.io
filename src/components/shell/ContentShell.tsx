import { ReactNode } from "react";

export function ContentShell({
  wrapperClassName,
  sidebar,
  content,
  toc,
}: {
  wrapperClassName?: string;
  sidebar: ReactNode;
  content: ReactNode;
  toc?: ReactNode;
}) {
  return (
    <div className={`container-fluid bg-dimmed wrapper ${wrapperClassName ?? ""}`.trim()}>
      <section className="sidebar-section sidebar-section-flex" id="sidebar-section">
        {sidebar}
      </section>
      <section className="content-section" id="content-section">
        {content}
      </section>
      {toc ? (
        <section className="toc-section" id="toc-section">
          {toc}
        </section>
      ) : null}
    </div>
  );
}

