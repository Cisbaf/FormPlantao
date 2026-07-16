import { FormularioUnico, FormularioDTO, MarcacaoDTO, Funcionario } from "./types";
import { API_BASE_URL } from "./constants";

// Re-export types and utils for backwards compatibility
export type { Funcionario, FormularioUnico, Marcacao, FormularioDTO, MarcacaoDTO } from "./types";
export { parseYearMonth, parseLocalDate } from "./utils";

// ========================
// API Calls - Formulários
// ========================

export async function fetchFormularios(): Promise<FormularioUnico[]> {
  const res = await fetch(`${API_BASE_URL}/formularios`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar formulários");
  }
  return res.json();
}

export async function createFormulario(dto: FormularioDTO): Promise<FormularioDTO> {
  const res = await fetch(`${API_BASE_URL}/formularios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error("Erro ao criar formulário");
  }
  return res.json();
}

export async function updateFormulario(id: number, dto: { horas: number }) {
  const res = await fetch(`${API_BASE_URL}/formularios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })
  if (!res.ok) {
    throw new Error("Erro ao editar formulário")
  }
  return res.json

}


export async function deleteByDataReferencia(data: string) {
  const res = await fetch(`${API_BASE_URL}/formularios/data?dataReferencia=${data}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar formulário")
  }
}

// ========================
// API Calls - Funcionários
// ========================

export async function fetchFuncionarios(): Promise<Funcionario[]> {
  const res = await fetch(`${API_BASE_URL}/funcionarios`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Erro ao buscar funcionários");
  }
  return res.json();
}

export async function createFuncionario(funcionario: Funcionario): Promise<Funcionario> {
  const res = await fetch(`${API_BASE_URL}/funcionarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(funcionario),
  });
  if (!res.ok) {
    throw new Error("Erro ao salvar funcionário");
  }
  return res.json();
}

export async function deleteFuncionario(id: number) {
  const res = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar funcionário");
  }
  // Como o backend retorna 204 (No Content), não tentamos ler o JSON:
  if (res.status === 204) return;
}

export async function updateFuncionario(id: number, dados: { nome: string; matricula: number; locacao: string }) {
  const res = await fetch(`${API_BASE_URL}/funcionarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar funcionário");
  }

  return res.json();
}

// ========================
// API Calls - Marcações
// ========================

export async function createMarcacao(dto: MarcacaoDTO): Promise<MarcacaoDTO> {
  const res = await fetch(`${API_BASE_URL}/marcacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error("Erro ao salvar marcação");
  }
  return res.json();
}

export async function updateMarcacao(id: number, dto: MarcacaoDTO): Promise<MarcacaoDTO> {
  const res = await fetch(`${API_BASE_URL}/marcacoes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar marcação");
  }
  return res.json();
}
