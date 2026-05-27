"use client";

import { GomokuLogo } from "@/shared/components/brand/GomokuLogo";
import { setLoggedIn } from "@/features/auth/lib/session";
import { mergeDisplayNameOnLogin } from "@/features/profile/lib/settings/storage";
import { APP_NAME, DEMO_LOGIN } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("用户名和密码不能为空");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (username === DEMO_LOGIN.username && password === DEMO_LOGIN.password) {
      setLoggedIn(username);
      mergeDisplayNameOnLogin(username);
      router.push("/lobby");
    } else {
      setError("用户名或密码错误（演示账号: test / password）");
    }
    setLoading(false);
  };

  return (
    <div
      className="login-scope dot-grid-bg relative flex min-h-app items-center justify-center p-4 px-safe pb-safe pt-safe sm:p-6"
      data-login-page
    >
      <div className="glass-card w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(212,35,55,0.08)] sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <GomokuLogo size={88} className="mb-5 sm:mb-6" />
          <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-login-primary sm:text-3xl">
            {APP_NAME}
          </h1>
          <p className="mt-2.5 max-w-[16rem] text-sm leading-relaxed text-secondary sm:max-w-none">
            专注 · 谋略 · 精进
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-login-primary">
              用户名
            </label>
            <div className="relative mt-1">
              <input
                id="username"
                placeholder="请输入您的用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-3 text-on-surface outline-none transition-shadow focus:border-login-primary focus:ring-2 focus:ring-login-primary/20"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                person
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-login-primary">
                密码
              </label>
              <button type="button" className="text-sm text-login-primary hover:underline">
                忘记密码?
              </button>
            </div>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="········"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-10 text-on-surface outline-none transition-shadow focus:border-login-primary focus:ring-2 focus:ring-login-primary/20"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-error">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full rounded-full bg-login-primary py-3 font-semibold text-white shadow-lg shadow-login-primary/25",
              "transition-all hover:bg-[#c01f2f] active:scale-[0.98] disabled:opacity-70",
            )}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-outline-variant" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-secondary">或通过以下方式继续</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-outline-variant py-2.5 text-sm text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <span className="text-lg">&#63743;</span>
            Apple
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-outline-variant py-2.5 text-sm text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <span className="text-lg text-[#07C160]">微</span>
            微信
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-login-primary/70">
          <button type="button" className="hover:text-login-primary hover:underline">
            隐私政策
          </button>
          <span className="mx-2 opacity-50">•</span>
          <button type="button" className="hover:text-login-primary hover:underline">
            服务条款
          </button>
        </div>
      </div>
    </div>
  );
}
