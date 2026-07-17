// ========================
// Entidades / Models
// ========================

export interface Funcionario {
  id?: number;
  nome: string;
  matricula: number;
  locacao: string;
}

export interface Marcacao {
  id?: number;
  dataMarcada: any; // Can be string "YYYY-MM-DD" or array [YYYY, MM, DD]
  marca: string; // String com até 2 caracteres (ex: "T", "TF" para 24h com dois plantões)
}

export interface Horas {
  id?: number;
  horasPlantoes: number;
  horasExtras: number;
  horasFerias: number;
  horasAusentes: number;
}

export interface FormularioUnico {
  id?: number;
  horas: number;
  dataReferencia: any; // Can be string "YYYY-MM" or array [YYYY, MM]
  funcionario: Funcionario;
  marcacoes?: Marcacao[];
  horasTotais?: Horas;
}

// ========================
// DTOs (Data Transfer Objects)
// ========================

export interface FormularioDTO {
  id?: number;
  horas: number;
  dataReferencia: string; // "YYYY-MM"
  funcionarioId: number;
  marcacoesId: number[];
  horasDto?: Horas;
}

export interface MarcacaoDTO {
  id?: number;
  dataMarcada: string; // "YYYY-MM-DD"
  marca: string; // String com até 2 caracteres
  formId: number;
}

export interface RelatorioLocacaoDTO {
  locacao: string;
  totalPlantoes: number;
  totalExtras: number;
  totalFerias: number;
  totalAusentes: number;
}

// ========================
// View Models
// ========================

export interface GroupedMonth {
  yearMonth: string; // "YYYY-MM"
  label: string; // "Julho de 2026"
  forms: FormularioUnico[];
}

export interface SectorGroup {
  sector: string;
  forms: FormularioUnico[];
}

export interface EditingCell {
  form: FormularioUnico;
  date: Date;
  dateStr: string;
  existingMarking?: Marcacao;
}

export interface MarkColorConfig {
  bg: string;
  text: string;
  label: string;
}

export interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}
