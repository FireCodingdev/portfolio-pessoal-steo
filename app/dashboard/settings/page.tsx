"use client";

import { useState } from "react";
import { PageHeader, Card, Field, TextInput } from "@/components/dashboard/FormKit";

export default function SettingsPage() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [status, setStatus] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function alterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (novaSenha !== confirmar) {
      setStatus({ tipo: "erro", texto: "A nova senha e a confirmação não coincidem." });
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch("/api/admin/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao trocar senha.");
      setStatus({ tipo: "ok", texto: "Senha alterada com sucesso!" });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmar("");
    } catch (err: any) {
      setStatus({ tipo: "erro", texto: err.message });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <PageHeader title="Configurações" description="Gerencie o acesso ao seu painel administrativo." />

      <Card className="max-w-md">
        <p className="text-sm font-semibold text-white mb-4">Alterar senha</p>
        <form onSubmit={alterarSenha}>
          <Field label="Senha atual">
            <TextInput type="password" required value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
          </Field>
          <Field label="Nova senha" hint="Mínimo de 6 caracteres.">
            <TextInput type="password" required minLength={6} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
          </Field>
          <Field label="Confirmar nova senha">
            <TextInput type="password" required minLength={6} value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
          </Field>

          {status && (
            <p className={`text-sm mb-4 ${status.tipo === "ok" ? "text-emerald-400" : "text-pink-soft"}`}>
              {status.texto}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="bg-pink hover:bg-pink-light disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-5 py-2.5 transition-colors"
          >
            {salvando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </Card>
    </div>
  );
}
