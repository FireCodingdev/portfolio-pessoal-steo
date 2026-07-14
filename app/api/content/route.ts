import { NextRequest, NextResponse } from "next/server";
import { getAllContent, setContent } from "@/lib/db";
import { CONTENT_SECTIONS, ContentSection } from "@/lib/defaultContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json(content);
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao buscar conteúdo." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body as { section: ContentSection; data: any };

    if (!section || !CONTENT_SECTIONS.includes(section)) {
      return NextResponse.json({ erro: "Seção inválida." }, { status: 400 });
    }
    if (data === undefined) {
      return NextResponse.json({ erro: "Dados não informados." }, { status: 400 });
    }

    await setContent(section, data);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao salvar conteúdo." }, { status: 500 });
  }
}
