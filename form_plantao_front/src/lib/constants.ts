import { MarkColorConfig } from "./types";

// ========================
// Cores e labels das marcações de plantão
// ========================

export const MARK_COLORS: Record<string, MarkColorConfig> = {
  P: { bg: "#3b82f6", text: "#ffffff", label: "Plantão 12 Horas (P)" },
  F: { bg: "#10b981", text: "#ffffff", label: "Férias (F)" },
  E: { bg: "#8b5cf6", text: "#ffffff", label: "Plantão Extra 12 Horas (E)" },
  L: { bg: "#f59e0b", text: "#ffffff", label: "Licença (L)" },
  A: { bg: "#ef4444", text: "#ffffff", label: "Ausência (A)" },
};

export const DEFAULT_MARK_COLOR: MarkColorConfig = {
  bg: "#6b7280",
  text: "#ffffff",
  label: "Outro",
};

// Máximo de caracteres na marca (1 para 12h, 2 para 24h)
export const MARCA_MAX_LENGTH = 2;

// Nomes dos meses em português
export const MONTH_NAMES_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const MONTH_NAMES_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export const WEEKDAY_NAMES_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// API base URL
export const API_BASE_URL = "http://localhost:8080";
