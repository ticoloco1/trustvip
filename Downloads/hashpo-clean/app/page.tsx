import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "HASHPO – Mini Sites, Paywall Videos & Jobs",
  description: "Create your professional mini site. Companies pay to unlock CVs. Earn 50% of every unlock.",
};

export default function Page() { return <HomePage />; }
