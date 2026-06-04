import Link from "next/link";
import { Markdown } from "@/components/mdx/Markdown";

export function SkillsSection({
  id = "skills",
  skills,
}: {
  id?: string;
  skills: { name: string; logo: string; url: string; summary: string }[];
}) {
  return (
    <div className="container-fluid anchor pb-5 skills-section" id={id}>
      <h1 className="text-center">Skills</h1>
      <div className="container d-flex-block">
        <div className="row" id="primary-skills">
          {skills.map((s) => (
            <div className="col-xs-12 col-sm-6 col-lg-4 pt-2" key={s.name}>
              <Link className="skill-card-link" href={s.url}>
                <div className="card">
                  <div className="card-head d-flex">
                    <img className="card-img-xs" src={s.logo} alt={s.name} />
                    <h5 className="card-title">{s.name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="card-text">
                      <Markdown source={s.summary} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

