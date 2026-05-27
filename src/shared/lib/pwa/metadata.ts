import type { Metadata, Viewport } from "next";
import {
  PWA_APP_NAME,
  PWA_BACKGROUND_COLOR,
  PWA_DESCRIPTION,
  PWA_ICONS,
  PWA_MANIFEST_PATH,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
} from "./config";

export const pwaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PWA_THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: PWA_THEME_COLOR },
  ],
  colorScheme: "light",
};

export const pwaMetadata: Metadata = {
  applicationName: PWA_SHORT_NAME,
  title: {
    default: `${PWA_APP_NAME} · 禅意五子棋`,
    template: `%s · ${PWA_APP_NAME}`,
  },
  description: PWA_DESCRIPTION,
  manifest: PWA_MANIFEST_PATH,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: PWA_SHORT_NAME,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: PWA_ICONS.icon192, sizes: "192x192", type: "image/png" },
      { url: PWA_ICONS.icon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: PWA_ICONS.appleTouch, sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: PWA_ICONS.icon512,
        color: PWA_THEME_COLOR,
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export { PWA_BACKGROUND_COLOR, PWA_THEME_COLOR };
