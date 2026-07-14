"use client";

import { PageHeader, Card, Field, TextInput, SaveBar, Loading, IconButton, AddButton } from "@/components/dashboard/FormKit";
import { useSection, novoId } from "@/lib/useSection";
import { defaultEducation, EducationItem } from "@/lib/defaultContent";

export default function EducationEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<EducationItem[]>("education", defaultEducation);

  if (carregando) return <Loading />;

  function atualizar(i: number, campo: keyof EducationItem, valor: any) {
    const novo = [...data];
    novo[i] = { ...novo[i], [campo]: valor };
    setData(novo);
  }

  return (
    <div>
      <PageHeader title="Educação" description="Cursos, certificações e formações acadêmicas." />

      <div className="space-y-4">
        {data.map((ed, i) => (
          <Card key={ed.id}>
            <div className="flex items-start gap-3">
              <Field label="Ícone (Font Awesome)">
                <TextInput value={ed.icone} onChange={(e) => atualizar(i, "icone", e.target.value)} className="w-40" />
              </Field>
              <Field label="Período" hint="Opcional">
                <TextInput value={ed.periodo} onChange={(e) => atualizar(i, "periodo", e.target.value)} className="w-40" />
              </Field>
              <div className="pt-6 ml-auto">
                <IconButton icon="fa-solid fa-trash" danger title="Remover" onClick={() => setData(data.filter((_, idx) => idx !== i))} />
              </div>
            </div>
            <Field label="Título do curso / certificação">
              <TextInput value={ed.titulo} onChange={(e) => atualizar(i, "titulo", e.target.value)} />
            </Field>
            <Field label="Instituição">
              <TextInput value={ed.instituicao} onChange={(e) => atualizar(i, "instituicao", e.target.value)} />
            </Field>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <AddButton
          label="Adicionar formação"
          onClick={() =>
            setData([...data, { id: novoId("edu"), icone: "fa-solid fa-book", periodo: "", titulo: "", instituicao: "" }])
          }
        />
      </div>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
