import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";

export const metadata: Metadata = {
  title: { default: "HASHPO – Mini Sites, Paywall Videos & Jobs", template: "%s | HASHPO" },
  description: "Create your professional mini site. Companies pay to unlock CVs. Earn 50% of every unlock.",
  metadataBase: new URL("https://hashpo.com"),
  openGraph: {
    type: "website", siteName: "HASHPO",
    title: "HASHPO – Mini Sites, Paywall Videos & Jobs",
    description: "Create your professional mini site with links, paywall videos, CV and portfolio.",
    url: "https://hashpo.com",
    images: [{ url: "https://hashpo.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@HashPoCom", images: ["https://hashpo.com/og-image.png"] },
  keywords: ["mini site","professional profile","paywall videos","CV unlock","USDC","Polygon"],
};

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
