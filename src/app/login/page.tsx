"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível entrar");
      return;
    }

    const { role } = await res.json();
    const from = searchParams.get("from");
    const destination =
      from ?? (role === "AGENCY" ? "/admin" : "/portal");
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-graphite px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-brand-white p-8 shadow-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-brand-red" />
          <h1 className="text-xl font-bold text-brand-graphite">
            Portal de Aprovação
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Entre para ver e aprovar os posts do mês
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-brand-red/30 bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
            {error}
          </div>
        )}

        <label className="mb-3 block text-sm font-medium text-brand-graphite">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
          />
        </label>

        <label className="mb-6 block text-sm font-medium text-brand-graphite">
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-brand-white transition hover:bg-brand-red-dark disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
