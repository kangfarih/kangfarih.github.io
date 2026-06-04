"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";

export function ProjectsSection({
  id = "projects",
  filters,
  projects,
}: {
  id?: string;
  filters: { name: string; filter: string }[];
  projects: {
    title: string;
    logo: string;
    role: string;
    timeline: string;
    url: string;
    repo: string;
    tags: string[];
    summary: string;
  }[];
}) {
  const [active, setActive] = useState("all");
  const [githubScriptLoaded, setGithubScriptLoaded] = useState(false);

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.tags.includes(active));
  }, [active, projects]);

  useEffect(() => {
    if (!githubScriptLoaded) return;
    const w = window as unknown as { renderGithubButton?: () => void };
    const id = window.setTimeout(() => {
      const nodes = document.getElementsByClassName("github-button-inactive");
      while (nodes.length > 0) {
        const el = nodes[0] as HTMLElement;
        if (el.classList) el.classList.replace("github-button-inactive", "github-button");
      }
      w.renderGithubButton?.();
    }, 0);
    return () => window.clearTimeout(id);
  }, [active, githubScriptLoaded, visible.length]);

  return (
    <div className="container-fluid anchor pb-5 projects-section" id={id}>
      <Script src="/js/github-button.js" strategy="afterInteractive" onLoad={() => setGithubScriptLoaded(true)} />
      <h1 className="text-center">Projects</h1>
      <div className="container ml-auto text-center">
        <div className="btn-group flex-wrap" role="group" id="project-filter-buttons">
          {filters.map((b) => (
            <button
              key={b.filter}
              type="button"
              className={`btn btn-dark ${active === b.filter ? "active" : ""}`}
              data-filter={b.filter}
              onClick={() => setActive(b.filter)}
              aria-pressed={active === b.filter}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
      <div className="container filtr-projects">
        <div className="row" id="project-card-holder">
          {visible.map((p) => (
            <div
              key={p.url}
              className="col-sm-12 col-md-6 col-lg-4 p-2 filtr-item"
              data-category={["all", ...p.tags].join(",")}
            >
              <div className="card mt-1">
                <div className="card">
                  <Link className="card-header" href={p.url}>
                    <div>
                      <div className="d-flex">
                        <img className="card-img-xs" src={p.logo} alt={p.title} />
                        <h5 className="card-title mb-0">{p.title}</h5>
                      </div>
                      <div className="sub-title">
                        <span>{p.role}</span>
                        <span>{p.timeline}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="card-body text-justify pt-1 pb-1">
                    <p>{p.summary}</p>
                    <span className="float-left">
                      {p.repo ? (
                        <a
                          className="github-button-inactive"
                          href={p.repo}
                          data-icon="octicon-standard"
                          data-show-count="true"
                          aria-label={`Star ${p.title}`}
                        >
                          Star
                        </a>
                      ) : null}
                    </span>
                    <span className="float-right">
                      <Link className="btn btn-outline-info btn-sm mb-2" href={p.url}>
                        Details
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
