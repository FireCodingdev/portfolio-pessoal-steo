"use client";

import { useEffect, useState } from "react";
import { PageHeader, Card, Loading } from "@/components/dashboard/FormKit";

type Metrics = {
  leads: { total: number; ultimos7dias: number; ultimos30dias: number };
  downloads: { total: number; ultimos7dias: number; ultimos30dias: number };
  visualizacoes: { total: number; ultimos30dias: number };
  grafico: { leadsPorDia: { dia: string; total: number }[]; downloadsPorDia: { dia: string; total: number }[] };
  ultimosLeads: { id: number; nome: string; email: string; assunto: string; created_at: string }[];
};

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: number | string; sub?: string }) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs font-medium">{label}</p>
        <p className="font-display text-3xl font-bold text-white mt-2">{value}</p>
        {sub && <p className="text-emerald-400 text-xs mt-1">{sub}</p>}
      </div>
      <div className="w-10 h-10 rounded-xl bg-pink/10 border border-pink/30 flex items-center justify-center text-pink">
        <i className={icon} />
      </div>
    </Card>
  );
}

function MiniBarChart({ data, cor = "#e91e8c" }: { data: { dia: string; total: number }[]; cor?: string }) {
  const max = Math.max(1, ...data.map((d) => d.total));
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{ height: `${Math.max(4, (d.total / max) * 100)}%`, background: cor, opacity: d.total ? 1 : 0.15 }}
            title={`${d.dia}: ${d.total}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/metrics", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.erro || "Erro ao carregar métricas.");
        return data;
      })
      .then(setMetrics)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <PageHeader title="Visão Geral" description="Métricas reais do seu portfólio, atualizadas em tempo real." />

      {carregando && <Loading />}

      {erro && (
        <Card className="border-pink/30">
          <p className="text-pink-soft text-sm">
            ⚠️ {erro}. Verifique se o banco de dados (Postgres) foi conectado ao projeto na Vercel.
          </p>
        </Card>
      )}

      {metrics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="fa-solid fa-inbox"
              label="Total de mensagens (leads)"
              value={metrics.leads.total}
              sub={`+${metrics.leads.ultimos7dias} nos últimos 7 dias`}
            />
            <StatCard
              icon="fa-solid fa-file-arrow-down"
              label="Downloads do currículo"
              value={metrics.downloads.total}
              sub={`+${metrics.downloads.ultimos7dias} nos últimos 7 dias`}
            />
            <StatCard
              icon="fa-solid fa-eye"
              label="Visualizações do site"
              value={metrics.visualizacoes.total}
              sub={`${metrics.visualizacoes.ultimos30dias} nos últimos 30 dias`}
            />
            <StatCard
              icon="fa-solid fa-chart-line"
              label="Mensagens (30 dias)"
              value={metrics.leads.ultimos30dias}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <Card>
              <p className="text-sm font-semibold text-white mb-4">Mensagens recebidas — últimos 14 dias</p>
              {metrics.grafico.leadsPorDia.length > 0 ? (
                <MiniBarChart data={metrics.grafico.leadsPorDia} />
              ) : (
                <p className="text-gray-500 text-sm">Ainda não há dados suficientes.</p>
              )}
            </Card>
            <Card>
              <p className="text-sm font-semibold text-white mb-4">Downloads do currículo — últimos 14 dias</p>
              {metrics.grafico.downloadsPorDia.length > 0 ? (
                <MiniBarChart data={metrics.grafico.downloadsPorDia} cor="#ff80cc" />
              ) : (
                <p className="text-gray-500 text-sm">Ainda não há dados suficientes.</p>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <p className="text-sm font-semibold text-white mb-4">Últimas mensagens recebidas</p>
            {metrics.ultimosLeads.length === 0 && (
              <p className="text-gray-500 text-sm">Nenhuma mensagem recebida ainda.</p>
            )}
            <div className="divide-y divide-white/5">
              {metrics.ultimosLeads.map((lead) => (
                <div key={lead.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{lead.nome}</p>
                    <p className="text-gray-500 text-xs truncate">{lead.assunto || lead.email}</p>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
            <a href="/dashboard/leads" className="inline-block mt-4 text-pink-soft text-sm font-medium hover:underline">
              Ver todas as mensagens →
            </a>
          </Card>
        </>
      )}
    </div>
  );
}
