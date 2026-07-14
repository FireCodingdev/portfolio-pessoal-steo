"use client";

import { PageHeader, Card, Field, TextInput, TextArea, SaveBar, Loading, IconButton, AddButton } from "@/components/dashboard/FormKit";
import { useSection, novoId } from "@/lib/useSection";
import { defaultExperience, ExperienceItem } from "@/lib/defaultContent";

export default function ExperienceEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<ExperienceItem[]>("experience", defaultExperience);

  if (carregando) return <Loading />;

  function atualizar(i: number, campo: keyof ExperienceItem, valor: any) {
    const novo = [...data];
    novo[i] = { ...novo[i], [campo]: valor };
    setData(novo);
  }

  return (
    <div>
      <PageHeader title="Experiência" description="Sua trajetória profissional e acadêmica, em ordem cronológica." />

      <div className="space-y-4">
        {data.map((exp, i) => (
          <Card key={exp.id}>
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Field label="Empresa / local" hint="Ex: Empresa X – Cidade, UF">
                  <TextInput value={exp.cargo} onChange={(e) => atualizar(i, "cargo", e.target.value)} />
                </Field>
                <Field label="Cargo">
                  <TextInput value={exp.empresa} onChange={(e) => atualizar(i, "empresa", e.target.value)} />
                </Field>
              </div>
              <div className="pt-6">
                <IconButton icon="fa-solid fa-trash" danger title="Remover" onClick={() => setData(data.filter((_, idx) => idx !== i))} />
              </div>
            </div>
            <Field label="Descrição das atividades">
              <TextArea value={exp.descricao} onChange={(e) => atualizar(i, "descricao", e.target.value)} />
            </Field>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <AddButton
          label="Adicionar experiência"
          onClick={() => setData([...data, { id: novoId("exp"), cargo: "", empresa: "", descricao: "" }])}
        />
      </div>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
