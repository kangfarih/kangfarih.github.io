import { siteProfile } from "@/content/profile";
import { TypingCarousel } from "@/components/home/TypingCarousel";
import { HomePortfolioSection } from "@/components/home/HomePortfolioSection";

export default function HomePage() {
  const aboutParagraphs = String(siteProfile.aboutMarkdown || "")
    .split(/\n\s*\n/g)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-20">
      <section id="home" className="-mt-20 relative h-[100svh] overflow-hidden px-0 py-0 text-center">
        <style>{`
          #homePageBackgroundImageDivStyled{background-image:url(${JSON.stringify(siteProfile.homeBackgroundRules[0]?.url ?? "")});}
          ${siteProfile.homeBackgroundRules
            .filter((r) => r.media && r.url)
            .map((r) => `@media ${r.media}{#homePageBackgroundImageDivStyled{background-image:url(${JSON.stringify(r.url)})}}`)
            .join("\n")}
        `}</style>
        <div
          id="homePageBackgroundImageDivStyled"
          className="absolute inset-0 -z-20 bg-cover bg-center [background-attachment:fixed] [transform:scale(1.1)] [filter:blur(3px)]"
        />
        <div className="absolute inset-0 -z-10 bg-black/70" />

        <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-6">
          <div className="relative h-32 w-32 lg:h-36 lg:w-36">
            <img
              src={siteProfile.authorImage}
              alt=""
              className="absolute inset-0 h-full w-full rounded-full border-4 border-[color:var(--foundation-white-light)] object-cover"
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--foundation-white-light)] lg:text-5xl">
            {siteProfile.greeting}
          </h1>

          <div className="flex flex-col items-center gap-2">
            <TypingCarousel items={siteProfile.taglines} />
          </div>

          <a
            href="#about"
            className="absolute bottom-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--foundation-white-light)] text-[color:var(--foundation-white-light)]"
            aria-label="Scroll to about"
          >
            <span className="animate-bounce">⌄</span>
          </a>
        </div>
      </section>

      <section id="about" className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex flex-col gap-4 lg:max-w-[560px] lg:self-stretch">
          <h2 className="text-2xl font-extrabold text-[color:var(--foundation-white-light)]">About me</h2>
          <div className="text-sm leading-relaxed text-[color:var(--foundation-white-dark)]">
            {aboutParagraphs.map((p) => (
              <p key={p} className="mt-3">
                {p}
              </p>
            ))}
          </div>
          <a
            href={siteProfile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex w-fit items-center justify-center rounded-xl bg-[color:var(--foundation-orange-normal)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--foundation-orange-normal-hover)] active:bg-[color:var(--foundation-orange-normal-active)]"
          >
            Resume
          </a>
        </div>
        <section className="grid h-full grid-cols-2 content-start gap-4 sm:grid-cols-3 lg:w-[320px] lg:grid-cols-2 lg:self-stretch lg:place-content-center">
          {siteProfile.softSkills.map((s) => (
            <div key={s.name} className="soft-donut" style={softSkillVars(s.color, s.percentage ?? 100)}>
              <svg className="soft-donut-svg" viewBox="0 0 120 120" aria-hidden="true">
                <circle className="soft-donut-track" cx="60" cy="60" r="46" />
                <circle className="soft-donut-progress" cx="60" cy="60" r="46" />
              </svg>
              <span className="soft-donut-label">{s.name}</span>
            </div>
          ))}
        </section>
      </section>

      <section id="skills" className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[color:var(--foundation-white-light)]">Skills</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteProfile.skills.map((s) => (
            <a
              key={s.name}
              href={s.url}
              className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] p-6 transition-colors hover:bg-[color:var(--foundation-grey-dark)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--foundation-grey-dark)] text-[color:var(--foundation-orange-normal)]">
                  {s.logo ? <img src={s.logo} alt="" width={22} height={22} /> : <ServiceIcon />}
                </div>
                <h3 className="mt-4 text-sm font-extrabold text-[color:var(--foundation-white-light)]">{s.name}</h3>
                <p className="mt-3 text-sm text-[color:var(--foundation-white-dark)]">{stripMarkdown(s.summary)}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="experiences" className="experiences-section anchor pb-5">
        <h2 className="text-center text-2xl font-extrabold text-[color:var(--foundation-white-light)]">Experiences</h2>
        <div className="timeline mx-auto mt-6 flex w-full max-w-5xl flex-col text-left">
          {siteProfile.experiences.map((e, idx) => {
            const left = idx % 2 === 0;
            const isFirst = idx === 0;
            const isLast = idx === siteProfile.experiences.length - 1;

            return (
              <div key={`${e.role}-${e.company}-${idx}`}>
                {left ? (
                  <div className="row grid grid-cols-12 items-stretch">
                    <div
                      className={`col-span-2 text-center vertical-line d-inline-flex justify-content-center ${
                        isFirst ? "vertical-line-start" : ""
                      } ${isLast ? "vertical-line-end" : ""}`}
                    >
                      <div className="circle font-weight-bold">{idx + 1}</div>
                    </div>

                    <div className="col-span-10 lg:col-span-8">
                      <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] p-6">
                        <div className="experience-entry-heading">
                          <h5 className="text-base font-extrabold text-[color:var(--foundation-white-light)]">{e.role}</h5>
                          <h6 className="mt-1 text-sm font-semibold text-[color:var(--foundation-white-dark)]">
                            {e.companyUrl ? (
                              <a
                                href={e.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[color:var(--foundation-orange-normal)]"
                              >
                                {e.company}
                              </a>
                            ) : (
                              e.company
                            )}
                          </h6>
                          <p className="text-sm text-[color:var(--foundation-white-dark)]">{e.meta}</p>
                        </div>

                        {e.summary ? (
                          <p className="mt-4 text-sm leading-relaxed text-[color:var(--foundation-white-dark)]">{e.summary}</p>
                        ) : null}

                        {e.responsibilities?.length ? (
                          <>
                            <h6 className="mt-5 text-sm font-semibold text-[color:var(--foundation-white-dark)]">Responsibilities:</h6>
                            <ul className="mt-2 list-disc pl-5 text-sm text-[color:var(--foundation-white-dark)]">
                              {e.responsibilities.map((r) => (
                                <li key={r}>{r}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-2" />
                  </div>
                ) : (
                  <div className="row grid grid-cols-12 items-stretch justify-content-end">
                    <div className="col-span-10 lg:col-span-8 lg:col-start-3">
                      <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] p-6">
                        <div className="experience-entry-heading">
                          <h5 className="text-base font-extrabold text-[color:var(--foundation-white-light)]">{e.role}</h5>
                          <h6 className="mt-1 text-sm font-semibold text-[color:var(--foundation-white-dark)]">
                            {e.companyUrl ? (
                              <a
                                href={e.companyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-[color:var(--foundation-orange-normal)]"
                              >
                                {e.company}
                              </a>
                            ) : (
                              e.company
                            )}
                          </h6>
                          <p className="text-sm text-[color:var(--foundation-white-dark)]">{e.meta}</p>
                        </div>

                        {e.summary ? (
                          <p className="mt-4 text-sm leading-relaxed text-[color:var(--foundation-white-dark)]">{e.summary}</p>
                        ) : null}

                        {e.responsibilities?.length ? (
                          <>
                            <h6 className="mt-5 text-sm font-semibold text-[color:var(--foundation-white-dark)]">Responsibilities:</h6>
                            <ul className="mt-2 list-disc pl-5 text-sm text-[color:var(--foundation-white-dark)]">
                              {e.responsibilities.map((r) => (
                                <li key={r}>{r}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div
                      className={`col-span-2 text-center vertical-line d-inline-flex justify-content-center vertical-line-left-adjustment ${
                        isFirst ? "vertical-line-start" : ""
                      } ${isLast ? "vertical-line-end" : ""}`}
                    >
                      <div className="circle font-weight-bold">{idx + 1}</div>
                    </div>
                  </div>
                )}

                {!isLast ? (
                  <div className="row horizontal-line grid grid-cols-12">
                    <div className="col-span-2 timeline-side-div">
                      <div className={`corner ${left ? "top-right" : "bottom-right"}`} />
                    </div>
                    <div className="col-span-8">
                      <hr />
                    </div>
                    <div className="col-span-2 timeline-side-div">
                      <div className={`corner ${left ? "bottom-left" : "top-left"}`} />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <HomePortfolioSection filters={siteProfile.projectFilters} projects={siteProfile.projects} />
    </div>
  );
}

function stripMarkdown(s: string) {
  return String(s || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function ServiceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 7h10v10H7V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 11h10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function softSkillVars(color: string, percentage: number) {
  const pct = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 100;
  const dash = 2 * Math.PI * 46;
  const offset = dash * (1 - pct / 100);
  const stroke =
    color === "blue"
      ? "#7551E9"
      : color === "yellow"
        ? "#FFC212"
        : color === "pink"
          ? "#ED63D2"
          : color === "green"
            ? "#2DCA73"
            : color === "sky"
              ? "#2098D1"
              : color === "orange"
                ? "#FF7D51"
                : "var(--foundation-orange-normal)";

  return {
    ["--soft-donut-stroke" as any]: stroke,
    ["--soft-donut-dash" as any]: `${dash}`,
    ["--soft-donut-offset" as any]: `${offset}`,
  } as any;
}
