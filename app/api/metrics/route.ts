import { NextResponse } from "next/server";
import {
  countLeads,
  countLeadsSince,
  countEvents,
  countEventsSince,
  leadsPerDay,
  eventsPerDay,
  listLeads,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalLeads,
      leads7dias,
      leads30dias,
      totalDownloads,
      downloads7dias,
      downloads30dias,
      totalViews,
      views30dias,
      leadsPorDia,
      downloadsPorDia,
      ultimosLeads,
    ] = await Promise.all([
      countLeads(),
      countLeadsSince(7),
      countLeadsSince(30),
      countEvents("resume_download"),
      countEventsSince("resume_download", 7),
      countEventsSince("resume_download", 30),
      countEvents("page_view"),
      countEventsSince("page_view", 30),
      leadsPerDay(14),
      eventsPerDay("resume_download", 14),
      listLeads(5),
    ]);

    return NextResponse.json(
      {
        leads: { total: totalLeads, ultimos7dias: leads7dias, ultimos30dias: leads30dias },
        downloads: { total: totalDownloads, ultimos7dias: downloads7dias, ultimos30dias: downloads30dias },
        visualizacoes: { total: totalViews, ultimos30dias: views30dias },
        grafico: { leadsPorDia, downloadsPorDia },
        ultimosLeads,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao buscar métricas." }, { status: 500 });
  }
}
