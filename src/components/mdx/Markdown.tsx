import { renderMdx } from "@/lib/content/mdx";

export async function Markdown({ source }: { source: string }) {
  const content = await renderMdx(source);
  return <>{content}</>;
}

