import type { Metadata } from "next";
import MiniSiteEditor from "@/components/dashboard/MiniSiteEditor";
export const metadata: Metadata = { title: "Edit Mini Site", robots: "noindex" };
export default function Page() { return <MiniSiteEditor />; }
