import type { Metadata } from "next";
import SlugMarketplace from "@/components/slugs/SlugMarketplace";
export const metadata: Metadata = {
  title: "Slug Marketplace — Buy, Sell & Bid on Premium Slugs",
  description: "Register your unique HASHPO slug. Premium 1-3 letter slugs, auctions, and user listings. From $12/year.",
};
export default function Page() { return <SlugMarketplace />; }
