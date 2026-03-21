import type { Metadata } from "next";
import AuthPage from "@/components/AuthPage";
export const metadata: Metadata = { title: "Sign in to HASHPO" };
export default function Page() { return <AuthPage />; }
