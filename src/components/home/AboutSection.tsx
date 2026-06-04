import { Markdown } from "@/components/mdx/Markdown";

export function AboutSection({
  id = "about",
  name,
  designation,
  aboutMarkdown,
  socials,
  resumeUrl,
  softSkills,
}: {
  id?: string;
  name: string;
  designation: string;
  aboutMarkdown: string;
  socials: { href: string; icon: string }[];
  resumeUrl: string;
  softSkills: { name: string; percentage?: number; color: string }[];
}) {
  return (
    <div className="container anchor p-lg-5 about-section" id={id}>
      <div className="row pt-sm-2 pt-md-4 align-self-center">
        <div className="col-sm-6">
          <h3 className="p-1">{name}</h3>
          <h5 className="p-1">{designation}</h5>
          <div className="p-1 text-justify">
            <Markdown source={aboutMarkdown} />
          </div>
          <div className="text-container ml-auto">
            <ul className="social-link d-flex">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <i className={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              <button className="btn btn-dark">My resume</button>
            </a>
          ) : null}
        </div>
        <div className="col-sm-6 pt-5 pl-md-4 pl-sm-3 pt-sm-0">
          <div className="row">
            {softSkills.map((s) => (
              <div className="col-6 col-lg-4 p-2" key={s.name}>
                <div className={`circular-progress ${s.color}`}>
                  <span className="circular-progress-left">
                    <span className={`circular-progress-bar circular-progress-percentage-${s.percentage ?? 50}`} />
                  </span>
                  <span className="circular-progress-right">
                    <span className="circular-progress-bar" />
                  </span>
                  <div className="circular-progress-value">{s.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

