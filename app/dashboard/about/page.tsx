"use client";

import { PageHeader, Card, Field, TextInput, TextArea, SaveBar, Loading } from "@/components/dashboard/FormKit";
import { useSection } from "@/lib/useSection";
import { defaultAbout, AboutContent } from "@/lib/defaultContent";

export default function AboutEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<AboutContent>("about", defaultAbout);

  if (carregando) return <Loading />;

  return (
    <div>
      <PageHeader title="Sobre Mim" description="Informações pessoais e o texto de apresentação." />

      <Card>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome"><TextInput value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} /></Field>
          <Field label="Curso"><TextInput value={data.curso} onChange={(e) => setData({ ...data, curso: e.target.value })} /></Field>
          <Field label="Localização"><TextInput value={data.localizacao} onChange={(e) => setData({ ...data, localizacao: e.target.value })} /></Field>
          <Field label="Status"><TextInput value={data.status} onChange={(e) => setData({ ...data, status: e.target.value })} /></Field>
          <Field label="Foco"><TextInput value={data.foco} onChange={(e) => setData({ ...data, foco: e.target.value })} /></Field>
          <Field label="Nível de inglês"><TextInput value={data.ingles} onChange={(e) => setData({ ...data, ingles: e.target.value })} /></Field>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-semibold text-white mb-4">Texto de apresentação</p>
        <Field label="Parágrafo 1">
          <TextArea value={data.paragrafo1} onChange={(e) => setData({ ...data, paragrafo1: e.target.value })} />
        </Field>
        <Field label="Parágrafo 2">
          <TextArea value={data.paragrafo2} onChange={(e) => setData({ ...data, paragrafo2: e.target.value })} />
        </Field>
        <Field label="Parágrafo 3">
          <TextArea value={data.paragrafo3} onChange={(e) => setData({ ...data, paragrafo3: e.target.value })} />
        </Field>
        <Field label="Link do currículo (PDF)" hint="Padrão: /curriculo.pdf — o arquivo que já está no site. Você pode colar outro link se preferir.">
          <TextInput value={data.curriculoUrl} onChange={(e) => setData({ ...data, curriculoUrl: e.target.value })} />
        </Field>
      </Card>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
