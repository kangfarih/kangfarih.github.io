import profile from "./profile.json";

export type Profile = {
  greeting: string;
  name: string;
  designation: string;
  homeBackgroundRules: { media: string | null; url: string }[];
  authorImage: string;
  lastUpdate: string;
  taglines: string[];
  aboutMarkdown: string;
  resumeUrl: string;
  socials: { href: string; icon: string }[];
  softSkills: { name: string; percentage?: number; color: string }[];
  skills: { name: string; logo: string; url: string; summary: string }[];
  experiences: {
    role: string;
    company: string;
    companyUrl: string;
    meta: string;
    summary: string;
    responsibilities: string[];
  }[];
  projectFilters: { name: string; filter: string }[];
  projects: {
    title: string;
    logo: string;
    role: string;
    timeline: string;
    url: string;
    repo: string;
    tags: string[];
    summary: string;
  }[];
  recentPosts: { title: string; summary: string; date: string; url: string; hero: string }[];
};

export const siteProfile = profile as Profile;
