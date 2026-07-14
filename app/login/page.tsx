"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.erro || "Não foi possível entrar.");
      }
      const redirect = params.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink/10 border border-pink/30 mb-4">
            <i className="fa-solid fa-lock text-pink text-xl" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Painel Administrativo</h1>
          <p className="text-gray-400 text-sm mt-1">Entre para gerenciar seu portfólio</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-1 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-2 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-pink transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-dark-2 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-pink transition-colors"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <div className="bg-pink/10 border border-pink/30 text-pink-soft text-sm rounded-lg px-3.5 py-2.5">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-pink hover:bg-pink-light disabled:opacity-60 text-white font-semibold text-sm rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <a href="/" className="block text-center text-gray-500 text-xs mt-6 hover:text-gray-300 transition-colors">
          ← Voltar para o site
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
