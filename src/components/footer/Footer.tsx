export function Footer({
  navAnchors,
  lastUpdate,
}: {
  navAnchors: { label: string; href: string }[];
  lastUpdate: string;
}) {
  return (
    <footer className="container-fluid footer py-4">
      <div className="container">
        <ul className="footer-nav">
          {navAnchors.map((l) => (
            <li key={l.href}>
              <a className="smooth-scroll" href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        {lastUpdate ? <div className="footer-meta text-center">{lastUpdate}</div> : null}
      </div>
    </footer>
  );
}
