import { NextResponse } from "next/server";
import { logEvent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Público: chamado uma vez quando o site é carregado, para contar visitas.
export async function POST() {
  try {
    await logEvent("page_view");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao registrar evento." }, { status: 500 });
  }
}
