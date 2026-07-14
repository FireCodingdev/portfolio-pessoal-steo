import { NextRequest, NextResponse } from "next/server";
import { deleteLead, updateLeadStatus } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ erro: "Dados inválidos." }, { status: 400 });
    }
    await updateLeadStatus(id, String(status));
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao atualizar lead." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ erro: "Id inválido." }, { status: 400 });
    }
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ erro: err.message || "Erro ao excluir lead." }, { status: 500 });
  }
}
