export function ExperiencesSection({
  id = "experiences",
  experiences,
}: {
  id?: string;
  experiences: {
    role: string;
    company: string;
    companyUrl: string;
    meta: string;
    summary: string;
    responsibilities: string[];
  }[];
}) {
  return (
    <div className="container-fluid anchor pb-5 experiences-section" id={id}>
      <h1 className="text-center">Experiences</h1>
      <div className="container timeline text-justify">
        {experiences.map((e, idx) => (
          <ExperienceRow entry={e} index={idx} isLast={idx === experiences.length - 1} key={`${e.company}:${e.role}:${idx}`} />
        ))}
      </div>
    </div>
  );
}

function ExperienceRow({
  entry,
  index,
  isLast,
}: {
  entry: {
    role: string;
    company: string;
    companyUrl: string;
    meta: string;
    summary: string;
    responsibilities: string[];
  };
  index: number;
  isLast: boolean;
}) {
  const num = index + 1;
  const isRight = index % 2 === 1;
  const separatorParity = index % 2;
  const leftCornerClass = separatorParity ? "bottom-right" : "top-right";
  const rightCornerClass = separatorParity ? "top-left" : "bottom-left";

  return (
    <>
      <div className={`row align-items-center d-flex ${isRight ? "justify-content-end" : ""}`}>
        {!isRight ? (
          <div className="col-1 col-lg-2 text-center vertical-line d-inline-flex justify-content-center">
            <div className="circle font-weight-bold">{num}</div>
          </div>
        ) : null}
        <div className="col-10 col-lg-8">
          <div className="experience-entry-heading">
            <h5>{entry.role}</h5>
            <h6>
              {entry.companyUrl ? (
                <a href={entry.companyUrl} target="_blank" rel="noreferrer">
                  {entry.company}
                </a>
              ) : (
                <span>{entry.company}</span>
              )}
            </h6>
            <p className="text-muted">{entry.meta}</p>
          </div>
          {entry.summary ? <p>{entry.summary}</p> : null}
          <h6 className="text-muted">Responsibilities:</h6>
          <ul className="justify-content-around">
            {entry.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        {isRight ? (
          <div className="col-1 col-lg-2 text-center vertical-line vertical-line-left-adjustment d-inline-flex justify-content-center">
            <div className="circle font-weight-bold">{num}</div>
          </div>
        ) : null}
      </div>
      {!isLast ? (
        <div className="row horizontal-line">
          <div className="col-1 col-lg-2 timeline-side-div">
            <div className={`corner ${leftCornerClass}`} />
          </div>
          <div className="col-10 col-lg-8">
            <hr />
          </div>
          <div className="col-1 col-lg-2 timeline-side-div">
            <div className={`corner ${rightCornerClass}`} />
          </div>
        </div>
      ) : null}
    </>
  );
}
