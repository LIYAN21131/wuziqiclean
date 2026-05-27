import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/providers/AppProviders";
import { FontLinks } from "@/shared/components/layout/FontLinks";
import { PwaHeadExtras } from "@/shared/components/pwa/PwaHeadExtras";
import { pwaMetadata, pwaViewport } from "@/shared/lib/pwa/metadata";
import { getFontBootstrapScript } from "@/shared/theme/font-theme";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = pwaMetadata;
export const viewport: Viewport = pwaViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <FontLinks />
        <PwaHeadExtras />
        <Script
          id="font-theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getFontBootstrapScript() }}
        />
      </head>
      <body className="pwa-app font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
