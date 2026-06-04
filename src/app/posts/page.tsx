import { listEntries } from "@/lib/content/fs";
import type { Metadata } from "next";
import { PostsListPage } from "@/components/posts/PostsListPage";

export const metadata: Metadata = {
  title: "Posts",
  description: "Post list.",
};

export default async function PostsIndexPage() {
  const entries = await listEntries("posts");
  return <PostsListPage allEntries={entries} visibleEntries={entries} activeHref={null} />;
}
