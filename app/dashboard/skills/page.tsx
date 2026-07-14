"use client";

import { PageHeader, Card, Field, TextInput, SaveBar, Loading, IconButton, AddButton } from "@/components/dashboard/FormKit";
import { useSection, novoId } from "@/lib/useSection";
import { defaultSkills, SkillCategory } from "@/lib/defaultContent";

export default function SkillsEditor() {
  const { data, setData, carregando, salvando, status, salvar } = useSection<SkillCategory[]>("skills", defaultSkills);

  if (carregando) return <Loading />;

  function atualizar(i: number, campo: keyof SkillCategory, valor: any) {
    const novo = [...data];
    novo[i] = { ...novo[i], [campo]: valor };
    setData(novo);
  }

  return (
    <div>
      <PageHeader
        title="Habilidades Técnicas"
        description="Categorias de habilidades exibidas no site. Use ícones do Font Awesome (ex: fa-solid fa-code)."
      />

      <div className="space-y-4">
        {data.map((cat, i) => (
          <Card key={cat.id}>
            <div className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Field label="Ícone (Font Awesome)" hint="Ex: fa-solid fa-code">
                  <TextInput value={cat.icone} onChange={(e) => atualizar(i, "icone", e.target.value)} />
                </Field>
                <Field label="Título da categoria">
                  <TextInput value={cat.titulo} onChange={(e) => atualizar(i, "titulo", e.target.value)} />
                </Field>
              </div>
              <div className="pt-6">
                <IconButton icon="fa-solid fa-trash" danger title="Remover categoria" onClick={() => setData(data.filter((_, idx) => idx !== i))} />
              </div>
            </div>
            <Field label="Tecnologias (separadas por vírgula)">
              <TextInput
                value={cat.tags.join(", ")}
                onChange={(e) => atualizar(i, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                placeholder="HTML5, CSS3, JavaScript..."
              />
            </Field>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <AddButton
          label="Adicionar categoria de habilidade"
          onClick={() =>
            setData([...data, { id: novoId("cat"), icone: "fa-solid fa-star", titulo: "Nova categoria", tags: [] }])
          }
        />
      </div>

      <SaveBar onSave={() => salvar()} salvando={salvando} status={status} />
    </div>
  );
}
