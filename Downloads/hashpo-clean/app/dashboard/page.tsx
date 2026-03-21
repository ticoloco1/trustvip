import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/Dashboard";
export const metadata: Metadata = { title: "Dashboard", robots: "noindex" };
export default function Page() { return <Dashboard />; }
