import { GomokuLogo } from "@/shared/components/brand/GomokuLogo";
import Link from "next/link";

/** PWA 离线回退页 — 由 Workbox document fallback 使用 */
export default function OfflinePage() {
  return (
    <div className="dot-grid-bg flex min-h-[100dvh] flex-col items-center justify-center px-6 pb-safe pt-safe">
      <GomokuLogo size={72} animated={false} showGlow={false} />
      <h1 className="mt-6 text-headline-mobile text-login-primary">当前处于离线</h1>
      <p className="mt-2 max-w-xs text-center text-sm text-secondary">
        请检查网络连接后重试。已缓存的页面在离线时仍可访问。
      </p>
      <Link
        href="/"
        className="btn-scale-safe mt-8 rounded-full bg-login-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-login-primary/25"
      >
        返回首页
      </Link>
    </div>
  );
}
