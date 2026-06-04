import { siteProfile } from "@/content/profile";

function SocialIcon({ href }: { href: string }) {
  if (href.startsWith("mailto:")) return <MailIcon />;
  if (href.includes("github.com")) return <GitHubIcon />;
  if (href.includes("gitlab.com")) return <GitLabIcon />;
  if (href.includes("linkedin.com")) return <LinkedInIcon />;
  return <LinkIcon />;
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.41.21 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.96-2.34 4.82-4.58 5.08.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.03 10.03 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitLabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22 4.3 16.3l-2.1-6.5 2.1-6.5 4.1-.1L12 9.1l3.6-5.9 4.1.1 2.1 6.5-2.1 6.5L12 22Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 6.5A2.5 2.5 0 1 1 6.5 1.5a2.5 2.5 0 0 1 0 5Z"
        fill="currentColor"
        transform="translate(2 2)"
      />
      <path d="M5 9h3v10H5V9Z" fill="currentColor" />
      <path
        d="M11 9h3v1.6c.4-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V19h-3v-4.1c0-2-.1-3.2-2-3.2-1.9 0-2.2 1.5-2.2 3.1V19h-3V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 14a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" stroke="currentColor" strokeWidth="2" />
      <path d="M14 10a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Footer() {
  const email = siteProfile.socials.find((s) => s.href.startsWith("mailto:"))?.href?.replace(/^mailto:/, "") ?? "";
  return (
    <footer className="mt-20 border-t border-[color:var(--surface-border)] pt-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <nav className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold text-[color:var(--foundation-white-dark)]">
          <a className="hover:text-[color:var(--foundation-orange-normal)]" href="/">
            Home
          </a>
          <a className="hover:text-[color:var(--foundation-orange-normal)]" href="/#skills">
            Skills
          </a>
          <a className="hover:text-[color:var(--foundation-orange-normal)]" href="/#about">
            About me
          </a>
          <a className="hover:text-[color:var(--foundation-orange-normal)]" href="/portfolios/">
            Portfolios
          </a>
        </nav>

        <div className="flex items-center justify-center gap-4">
          {siteProfile.socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--surface-border)] bg-[color:var(--surface-bg)] text-[color:var(--foundation-white-dark)] transition-colors hover:bg-[color:var(--foundation-grey-dark)] hover:text-[color:var(--foundation-orange-normal)]"
            >
              <SocialIcon href={s.href} />
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-sm text-[color:var(--foundation-white-dark)]">
          {email ? (
            <div className="flex items-center gap-2">
              <MailIcon />
              <a className="hover:text-[color:var(--foundation-orange-normal)]" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          ) : null}
        </div>

        <div className="w-full max-w-xl border-t border-[color:var(--surface-border)]" />
        <p className="text-sm text-[color:var(--foundation-white-dark)]">Designed by {siteProfile.name}</p>
        <p className="text-sm text-[color:var(--foundation-white-dark)]">{siteProfile.lastUpdate}</p>
      </div>
    </footer>
  );
}
