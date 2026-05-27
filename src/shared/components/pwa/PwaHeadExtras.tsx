import {
  PWA_BACKGROUND_COLOR,
  PWA_ICONS,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
} from "@/shared/lib/pwa/config";

/** layout 内补充的 PWA link / meta（Next Metadata 未覆盖部分） */
export function PwaHeadExtras() {
  return (
    <>
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={PWA_SHORT_NAME} />
      <meta name="application-name" content={PWA_SHORT_NAME} />
      <meta name="msapplication-TileColor" content={PWA_THEME_COLOR} />
      <meta name="msapplication-tap-highlight" content="no" />
      <link rel="apple-touch-icon" href={PWA_ICONS.appleTouch} />
      <link rel="apple-touch-startup-image" href={PWA_ICONS.icon512} />
      <meta name="theme-color" content={PWA_THEME_COLOR} media="(prefers-color-scheme: light)" />
      <meta
        name="theme-color"
        content={PWA_THEME_COLOR}
        media="(prefers-color-scheme: dark)"
      />
      <meta name="color-scheme" content="light" />
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{color-scheme:light;}html{background-color:${PWA_BACKGROUND_COLOR};}`,
        }}
      />
    </>
  );
}
