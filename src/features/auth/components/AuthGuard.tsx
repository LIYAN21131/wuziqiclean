"use client";

import { isLoggedIn } from "@/features/auth/lib/session";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_PATHS = ["/", "/preview", "/~offline"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!isPublic && !isLoggedIn()) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
