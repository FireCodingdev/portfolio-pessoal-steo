"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Loading, IconButton } from "@/components/dashboard/FormKit";

type Lead = {
  id: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo", cor: "bg-pink/15 text-pink-soft border-pink/30" },
  { value: "em_contato", label: "Em contato", cor: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { value: "concluido", label: "Concluído", cor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);

  function carregar() {
    setCarregando(true);
    fetch("/api/leads")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.erro || "Erro ao carregar mensagens.");
        return data;
      })
      .then((data) => setLeads(data.leads))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function mudarStatus(id: number, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function excluir(id: number) {
    if (!confirm("Excluir esta mensagem? Essa ação não pode ser desfeita.")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <PageHeader
        title="Mensagens (Leads)"
        description="Todas as mensagens enviadas pelo formulário de contato do seu portfólio."
      />

      {carregando && <Loading />}
      {erro && (
        <Card className="border-pink/30 mb-4">
          <p className="text-pink-soft text-sm">⚠️ {erro}</p>
        </Card>
      )}

      {!carregando && !erro && leads.length === 0 && (
        <Card>
          <p className="text-gray-400 text-sm">Nenhuma mensagem recebida ainda.</p>
        </Card>
      )}

      <div className="space-y-3">
        {leads.map((lead) => {
          const statusInfo = STATUS_OPTIONS.find((s) => s.value === lead.status) || STATUS_OPTIONS[0];
          const expandido = aberto === lead.id;
          return (
            <Card key={lead.id} className="!p-0 overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setAberto(expandido ? null : lead.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-semibold">{lead.nome}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${statusInfo.cor}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{lead.assunto || "(sem assunto)"} · {lead.email}</p>
                </div>
                <span className="text-gray-500 text-xs shrink-0">
                  {new Date(lead.created_at).toLocaleString("pt-BR")}
                </span>
                <i className={`fa-solid fa-chevron-down text-gray-500 text-xs transition-transform ${expandido ? "rotate-180" : ""}`} />
              </button>

              {expandido && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{lead.mensagem}</p>
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => mudarStatus(lead.id, s.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          lead.status === s.value ? s.cor : "border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white ml-auto"
                    >
                      <i className="fa-solid fa-reply mr-1" /> Responder
                    </a>
                    <IconButton icon="fa-solid fa-trash" onClick={() => excluir(lead.id)} danger title="Excluir" />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
