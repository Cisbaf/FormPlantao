import { FormularioUnico, GroupedMonth, SectorGroup, MarkColorConfig } from "./types";
import { MONTH_NAMES_PT, MONTH_NAMES_SHORT, WEEKDAY_NAMES_SHORT, MARK_COLORS, DEFAULT_MARK_COLOR } from "./constants";

// ========================
// Parsing de datas vindas do backend
// ========================

/**
 * Converte `dataReferencia` (que pode vir como string, array ou objeto)
 * em um objeto com ano, mês, formatted ("YYYY-MM") e label ("Julho de 2026").
 */
export function parseYearMonth(dataReferencia: any) {
  let year = 2026;
  let month = 7;

  if (typeof dataReferencia === "string") {
    const parts = dataReferencia.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (Array.isArray(dataReferencia)) {
    year = dataReferencia[0];
    month = dataReferencia[1];
  } else if (dataReferencia && typeof dataReferencia === "object") {
    year = dataReferencia.year || 2026;
    const rawMonth = dataReferencia.monthValue || dataReferencia.month || 7;
    if (typeof rawMonth === "string") {
      const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
      ];
      const index = monthNames.indexOf(rawMonth.toUpperCase());
      month = index !== -1 ? index + 1 : 7;
    } else {
      month = rawMonth;
    }
  }

  const formattedMonth = String(month).padStart(2, "0");
  const formatted = `${year}-${formattedMonth}`;
  const label = `${MONTH_NAMES_PT[month - 1]} de ${year}`;

  return { year, month, formatted, label };
}

/**
 * Converte `dataMarcada` (string, array ou objeto) em "YYYY-MM-DD".
 */
export function parseLocalDate(data: any): string {
  if (typeof data === "string") {
    return data;
  }
  if (Array.isArray(data)) {
    const y = data[0];
    const m = String(data[1]).padStart(2, "0");
    const d = String(data[2]).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  if (data && typeof data === "object") {
    const y = data.year || 2026;
    const m = String(data.monthValue || data.month || 7).padStart(2, "0");
    const d = String(data.dayOfMonth || data.day || 13).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

// ========================
// Formatação de datas
// ========================

/**
 * Converte um Date JS para string "YYYY-MM-DD".
 */
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Retorna as informações do cabeçalho do dia (número, mês abreviado, dia da semana, fim de semana).
 */
export function getDayHeader(date: Date) {
  const dayNum = date.getDate();
  const monthName = MONTH_NAMES_SHORT[date.getMonth()];
  const weekDayName = WEEKDAY_NAMES_SHORT[date.getDay()];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return { dayNum, monthName, weekDayName, isWeekend };
}

// ========================
// Ciclo de plantão (dia 16 ao 15)
// ========================

/**
 * Gera a lista de dias do ciclo de plantão: dia 16 do mês anterior até o dia 15 do mês atual.
 */
export function getDaysInCycle(yearMonth: string): Date[] {
  const parts = yearMonth.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed

  const startDate = new Date(year, month - 1, 16);
  const endDate = new Date(year, month, 15);

  const daysList: Date[] = [];
  const current = new Date(startDate);

  let count = 0;
  while (current <= endDate && count < 40) {
    daysList.push(new Date(current));
    current.setDate(current.getDate() + 1);
    count++;
  }
  return daysList;
}

// ========================
// Agrupamentos
// ========================

/**
 * Agrupa formulários por mês de referência, para a tela inicial.
 */
export function groupFormulariosByMonth(formularios: FormularioUnico[]): GroupedMonth[] {
  const groups: Record<string, GroupedMonth> = {};

  formularios.forEach((form) => {
    const { formatted, label } = parseYearMonth(form.dataReferencia);
    if (!groups[formatted]) {
      groups[formatted] = {
        yearMonth: formatted,
        label,
        forms: [],
      };
    }
    groups[formatted].forms.push(form);
  });

  return Object.values(groups).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
}

/**
 * Agrupa formulários por setor/locação do funcionário, para a tela de detalhes.
 */
export function groupFormsBySector(forms: FormularioUnico[]): SectorGroup[] {
  const groups: Record<string, FormularioUnico[]> = {};

  forms.forEach((form) => {
    const sector = form.funcionario.locacao || "Sem Setor";
    if (!groups[sector]) {
      groups[sector] = [];
    }
    groups[sector].push(form);
  });

  // Ordena setores alfabeticamente, e funcionários dentro de cada setor pelo nome
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([sector, sectorForms]) => ({
      sector,
      forms: sectorForms.sort((a, b) => a.funcionario.nome.localeCompare(b.funcionario.nome)),
    }));
}

// ========================
// Cores das marcações
// ========================

/**
 * Retorna a configuração de cor para uma marca.
 * Como a marca pode ter 1 ou 2 caracteres, pega a cor da primeira letra.
 */
export function getMarkColor(marca: string): MarkColorConfig {
  if (!marca) return DEFAULT_MARK_COLOR;
  // Tenta encontrar a cor pela marca completa primeiro, depois pela primeira letra
  return MARK_COLORS[marca] || MARK_COLORS[marca[0]] || DEFAULT_MARK_COLOR;
}
