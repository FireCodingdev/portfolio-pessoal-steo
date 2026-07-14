import { NextResponse } from "next/server";
import { logEvent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Público: chamado pelo site quando um visitante baixa o currículo.
export async function POST() {
  try {
    await logEvent("resume_download");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao registrar evento." }, { status: 500 });
  }
}
