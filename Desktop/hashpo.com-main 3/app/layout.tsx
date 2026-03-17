import type { Metadata } from "next";
import "@/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HASHPO – Mini Sites, Paywall Videos & Jobs",
  description:
    "Create your professional mini site with links, paywall videos, CV and portfolio. Companies pay to unlock CVs. Earn 50% of every unlock.",
  openGraph: {
    title: "HASHPO – Mini Sites, Paywall Videos & Jobs",
    description: "Create your professional mini site with links, paywall videos, CV and portfolio.",
    url: "https://hashpo.com/",
    siteName: "HASHPO",
    images: [{ url: "https://hashpo.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HASHPO – Mini Sites, Paywall Videos & Jobs",
    description: "Create your professional mini site with links, paywall videos, CV and portfolio.",
  },
  metadataBase: new URL("https://hashpo.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
