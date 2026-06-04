import { listEntries } from "@/lib/content/fs";
import type { Metadata } from "next";
import { PortfoliosListPage } from "@/components/portfolios/PortfoliosListPage";

export const metadata: Metadata = {
  title: "Portfolios",
  description: "Portfolio list.",
};

export default async function PortfoliosIndexPage() {
  const entries = await listEntries("portfolios");
  return <PortfoliosListPage allEntries={entries} visibleEntries={entries} activeHref={null} />;
}
