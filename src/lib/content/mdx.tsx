import { compileMDX } from "next-mdx-remote/rsc";
import type React from "react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export async function renderMdx(source: string) {
  const compiled = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
    components: {
      ResponsiveIframe: (props: { src: string; title?: string }) => (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe
            src={props.src}
            title={props.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ),
      iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
          <iframe
            {...props}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ),
      a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const href = props.href ?? "";
        const isExternal = /^https?:\/\//i.test(href);
        if (!isExternal) return <a {...props} />;
        return <a {...props} target="_blank" rel="noreferrer" />;
      },
    },
  });

  return compiled.content;
}
