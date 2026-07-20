"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-brand-white/30 px-3 py-1.5 text-sm text-brand-white transition hover:bg-brand-white/10"
    >
      Sair
    </button>
  );
}
