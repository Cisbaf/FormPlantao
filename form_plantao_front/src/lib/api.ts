import { FormularioUnico, FormularioDTO, MarcacaoDTO, Funcionario, RelatorioLocacaoDTO, ContagemDiariaResponse } from "./types";
import { API_BASE_URL } from "./constants";

// Re-export types and utils for backwards compatibility
export type { Funcionario, FormularioUnico, Marcacao, FormularioDTO, MarcacaoDTO, RelatorioLocacaoDTO, ContagemDiaria, ContagemDiariaResponse } from "./types";
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

export async function fetchFormulariosPorDataReferencia(data: string): Promise<FormularioUnico[]> {
  const res = await fetch(`${API_BASE_URL}/formularios/data?dataReferencia=${data}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error("Erro ao deletar formulário")
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

export async function fetchRelatorioGeral(data: string): Promise<RelatorioLocacaoDTO[]> {
  // Garantimos que a string terá apenas o formato YYYY-MM exigido pelo YearMonth do Java
  // Caso venha algo como "2026-07-20", o split vai pegar apenas "2026-07"
  const anoMes = data ? data.substring(0, 7) : "";
  const url = `${API_BASE_URL}/marcacoes/relatorio-geral?data=${anoMes}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "No text");
    console.error(`Erro na API relatorio-geral: Código ${res.status} URL: ${url} Response: ${text}`);
    throw new Error(`Erro ao buscar relatório geral: ${res.status}`);
  }

  return res.json();
}

// ========================
// API Calls - Contagem Diária
// ========================

export async function fetchContagemDiaria(yearMonth: string): Promise<ContagemDiariaResponse> {
  const anoMes = yearMonth ? yearMonth.substring(0, 7) : "";
  const res = await fetch(`${API_BASE_URL}/marcacoes/contagem-diaria?data=${anoMes}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar contagem diária: ${res.status}`);
  }
  return res.json();
}
