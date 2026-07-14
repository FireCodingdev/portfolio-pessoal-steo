"use client";

import { PageHeader, Card, Field, TextInput, TextArea, SaveBar, Loading, IconButton, AddButton } from "@/components/dashboard/FormKit";
import { useSection } from "@/lib/useSection";
import { defaultHero, HeroContent } from "@/lib/defaultContent";

export default function HeroEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<HeroContent>("hero", defaultHero);

  if (carregando) return <Loading />;

  function atualizarStat(i: number, campo: "number" | "label", valor: string) {
    const novo = [...data.stats];
    novo[i] = { ...novo[i], [campo]: valor };
    setData({ ...data, stats: novo });
  }

  return (
    <div>
      <PageHeader title="Início (Hero)" description="A primeira seção que os visitantes veem ao abrir seu portfólio." />

      <Card>
        <Field label="Texto do selo (badge)">
          <TextInput value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Saudação">
            <TextInput value={data.saudacao} onChange={(e) => setData({ ...data, saudacao: e.target.value })} />
          </Field>
          <Field label="Seu nome">
            <TextInput value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} />
          </Field>
        </div>
        <Field label="Cargo / função">
          <TextInput value={data.cargo} onChange={(e) => setData({ ...data, cargo: e.target.value })} />
        </Field>
        <Field label="Descrição curta">
          <TextArea value={data.descricao} onChange={(e) => setData({ ...data, descricao: e.target.value })} />
        </Field>
        <Field label="URL da foto" hint="Cole o link de uma imagem (ex: enviada para imgur, ou o caminho /imagens/sua-foto.jpg se você substituir o arquivo no GitHub).">
          <TextInput value={data.fotoUrl} onChange={(e) => setData({ ...data, fotoUrl: e.target.value })} />
        </Field>
      </Card>

      <Card className="mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Texto do botão principal">
            <TextInput value={data.botaoPrimarioTexto} onChange={(e) => setData({ ...data, botaoPrimarioTexto: e.target.value })} />
          </Field>
          <Field label="Link do botão principal">
            <TextInput value={data.botaoPrimarioLink} onChange={(e) => setData({ ...data, botaoPrimarioLink: e.target.value })} />
          </Field>
          <Field label="Texto do botão secundário">
            <TextInput value={data.botaoSecundarioTexto} onChange={(e) => setData({ ...data, botaoSecundarioTexto: e.target.value })} />
          </Field>
          <Field label="Link do botão secundário">
            <TextInput value={data.botaoSecundarioLink} onChange={(e) => setData({ ...data, botaoSecundarioLink: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-white mb-4">Estatísticas (ex: 3+ Anos de Estudo)</p>
        <div className="space-y-3">
          {data.stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <TextInput
                value={s.number}
                onChange={(e) => atualizarStat(i, "number", e.target.value)}
                placeholder="Número (ex: 3+)"
                className="w-28"
              />
              <TextInput
                value={s.label}
                onChange={(e) => atualizarStat(i, "label", e.target.value)}
                placeholder="Legenda (ex: Anos de Estudo)"
                className="flex-1"
              />
              <IconButton
                icon="fa-solid fa-trash"
                danger
                title="Remover"
                onClick={() => setData({ ...data, stats: data.stats.filter((_, idx) => idx !== i) })}
              />
            </div>
          ))}
        </div>
        {data.stats.length < 4 && (
          <div className="mt-3">
            <AddButton label="Adicionar estatística" onClick={() => setData({ ...data, stats: [...data.stats, { number: "", label: "" }] })} />
          </div>
        )}
      </Card>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
