import { NextRequest, NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Público: qualquer visitante pode enviar uma mensagem pelo formulário de contato.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, email, assunto, mensagem, empresa } = body as {
      nome: string;
      email: string;
      assunto?: string;
      mensagem?: string;
      empresa?: string; // honeypot anti-spam (campo invisível)
    };

    // Honeypot: se o campo "empresa" (escondido no formulário) veio preenchido,
    // é quase certeza que foi um bot. Fingimos sucesso sem salvar nada.
    if (empresa) {
      return NextResponse.json({ ok: true });
    }

    if (!nome || !email) {
      return NextResponse.json({ erro: "Nome e email são obrigatórios." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ erro: "Email inválido." }, { status: 400 });
    }

    const lead = await createLead({
      nome: String(nome).slice(0, 200),
      email: String(email).slice(0, 200),
      assunto: String(assunto || "").slice(0, 300),
      mensagem: String(mensagem || "").slice(0, 5000),
    });

    return NextResponse.json({ ok: true, lead });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao enviar mensagem." }, { status: 500 });
  }
}

// Protegido pelo middleware: apenas o painel administrativo pode listar.
export async function GET() {
  try {
    const leads = await listLeads();
    return NextResponse.json(
      { leads },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao buscar leads." }, { status: 500 });
  }
}
