import { TypingCarousel } from "./TypingCarousel";

export function HomeHero({
  greeting,
  authorImage,
  backgroundRules,
  taglines,
  firstSectionId = "about",
}: {
  greeting: string;
  authorImage: string;
  backgroundRules: { media: string | null; url: string }[];
  taglines: string[];
  firstSectionId?: string;
}) {
  return (
    <div className="container-fluid home" id="home">
      <style>{buildBackgroundCss(backgroundRules)}</style>
      <span className="on-the-fly-behavior" />
      <div id="homePageBackgroundImageDivStyled" className="background container-fluid" />
      <div
        className="container content text-center"
        style={{ background: "transparent", padding: 0, paddingTop: 0, minHeight: 0 }}
      >
        <img src={authorImage} className="rounded-circle mx-auto d-block img-fluid" alt="" />
        <h1 className="greeting">{greeting}</h1>
        <TypingCarousel items={taglines} />
        <a href={`#${firstSectionId}`}>
          <i className="arrow bounce fas fa-chevron-down" />
        </a>
      </div>
    </div>
  );
}

function buildBackgroundCss(rules: { media: string | null; url: string }[]) {
  const lines: string[] = [];
  for (const rule of rules) {
    if (!rule.url) continue;
    if (!rule.media) {
      lines.push(`#homePageBackgroundImageDivStyled{background-image:url(${rule.url})}`);
      continue;
    }
    lines.push(`@media${rule.media}{#homePageBackgroundImageDivStyled{background-image:url(${rule.url})}}`);
  }
  return lines.join("\n");
}
