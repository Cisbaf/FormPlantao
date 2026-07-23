import { parseLocalDate } from "@/lib/api";
import { FormularioUnico, ContagemDiaria, ContagemDiariaResponse } from "@/lib/types";
import { formatDateToISO, getDayHeader, groupFormsBySector, getMarkColor } from "@/lib/utils";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import React, { useState } from "react";

function MarkingBadge({ marca }: { marca: string }) {
  if (!marca) {
    return <Box sx={{ color: "text.disabled", fontSize: "12px" }}>-</Box>;
  }

  if (marca.length === 1) {
    const color = getMarkColor(marca);
    return (
      <Box
        sx={{
          width: { xs: 32, sm: 28 },
          height: { xs: 32, sm: 28 },
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 800,
          bgcolor: color.bg,
          color: color.text,
          mx: "auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca}
      </Box>
    );
  }

  const color1 = getMarkColor(marca[0]);
  const color2 = getMarkColor(marca[1]);

  return (
    <Box sx={{ display: "flex", gap: "2px", justifyContent: "center", mx: "auto" }}>
      <Box
        sx={{
          width: { xs: 20, sm: 18 },
          height: { xs: 32, sm: 28 },
          borderRadius: "4px 0 0 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 800,
          bgcolor: color1.bg,
          color: color1.text,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca[0]}
      </Box>
      <Box
        sx={{
          width: { xs: 20, sm: 18 },
          height: { xs: 32, sm: 28 },
          borderRadius: "0 4px 4px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 800,
          bgcolor: color2.bg,
          color: color2.text,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca[1]}
      </Box>
    </Box>
  );
}

interface ScheduleTableProps {
  forms: FormularioUnico[];
  cycleDays: Date[];
  onCellClick: (form: FormularioUnico, day: Date) => void;
  onHoursChange?: (form: FormularioUnico, newHoras: number) => void;
  contagemDiaria?: ContagemDiariaResponse | null;
}

/** Cabeçalho do setor na tabela */
function SectorHeaderRow({ sector, colSpan }: { sector: string; colSpan: number }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        sx={{
          bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
          borderBottom: "2px solid",
          borderColor: "primary.main",
          py: 1.5,
          position: "sticky",
          left: 0,
          zIndex: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 4, height: 22, bgcolor: "primary.main", borderRadius: "2px" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "primary.main" }}>
            {sector}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

/** Linha de um funcionário */
function EmployeeRow({ form, cycleDays, onCellClick, onHoursChange }: { form: FormularioUnico; cycleDays: Date[]; onCellClick: (form: FormularioUnico, day: Date) => void; onHoursChange?: (form: FormularioUnico, newHoras: number) => void; }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectHour = (newHoras: number) => {
    if (newHoras !== form.horas && onHoursChange) {
      onHoursChange(form, newHoras);
    }
    handleClose();
  };

  return (
    <TableRow hover sx={{ "&:hover td": { bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" } }}>
      <TableCell sx={{ position: "sticky", left: 0, zIndex: 2, bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: "13px", fontWeight: "bold", bgcolor: "primary.main" }}>
            {form.funcionario.nome.substring(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{form.funcionario.nome}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Mat: {form.funcionario.matricula}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ fontWeight: 600, borderRight: "1px solid rgba(224,224,224,0.3)" }}>
        <Chip
          label={`${form.horas}h`}
          size="small"
          variant="outlined"
          onClick={handleClick}
          sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
        />
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <MenuItem onClick={() => handleSelectHour(12)} selected={form.horas === 12}>12 horas</MenuItem>
          <MenuItem onClick={() => handleSelectHour(24)} selected={form.horas === 24}>24 horas</MenuItem>
        </Menu>
      </TableCell>

      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#3b82f6" }}>{form.horasTotais?.horasPlantoes !== undefined ? form.horasTotais?.horasPlantoes * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#8b5cf6" }}>{form.horasTotais?.horasExtras !== undefined ? form.horasTotais?.horasExtras * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#10b981" }}>{form.horasTotais?.horasFerias !== undefined ? form.horasTotais?.horasFerias * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#ef4444" }}>{form.horasTotais?.horasAusentes !== undefined ? form.horasTotais?.horasAusentes * 12 : 0}</TableCell>

      {cycleDays.map((day, idx) => {
        const dateStr = formatDateToISO(day);
        const marking = form.marcacoes?.find((m) => parseLocalDate(m.dataMarcada) === dateStr);
        const brand = marking ? marking.marca : "";

        return (
          <TableCell
            key={idx}
            align="center"
            onClick={() => onCellClick(form, day)}
            sx={{
              p: 0.5,
              minWidth: { xs: "44px", sm: "48px" },
              minHeight: { xs: 44, sm: "auto" },
              cursor: "pointer",
              transition: "all 0.1s ease",
              borderRight: "1px solid",
              borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "primary.light", opacity: 0.8 },
            }}
          >
            <MarkingBadge marca={brand} />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

const SUMMARY_ROWS = [
  { key: "X", label: "Total Plantão Ordinário", color: "#3b82f6" },
  { key: "E", label: "Total Plantão Extra", color: "#8b5cf6" },
  { key: "F", label: "Total Férias", color: "#10b981" },
  { key: "A", label: "Total Ausências", color: "#ef4444" },
];

/** Componente que renderiza as linhas de totais */
function DailySummaryRows({ cycleDays, contagemDiaria }: { cycleDays: Date[]; contagemDiaria: ContagemDiaria }) {
  return (
    <>
      <TableRow>
        <TableCell
          colSpan={100}
          sx={{
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
            borderBottom: "2px solid",
            borderColor: "primary.main",
            py: 1.5,
            position: "sticky",
            left: 0,
            zIndex: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 4, height: 22, bgcolor: "primary.main", borderRadius: "2px" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "primary.main" }}>
              RESUMO GERAL DIÁRIO
            </Typography>
          </Box>
        </TableCell>
      </TableRow>

      {SUMMARY_ROWS.map(({ key, label, color }) => (
        <TableRow key={key} hover sx={{ "&:hover td": { bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" } }}>
          <TableCell
            sx={{
              position: "sticky",
              left: 0,
              zIndex: 2,
              bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
              borderRight: "1px solid rgba(224,224,224,0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: "15px", fontWeight: "bold", bgcolor: color, color: "#fff" }}>
                {key}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color }}>{label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Métricas Diárias
                </Typography>
              </Box>
            </Box>
          </TableCell>

          {[0, 1, 2, 3, 4].map((i) => (
            <TableCell
              key={`empty-${i}`}
              sx={{
                borderRight: "1px solid rgba(224,224,224,0.3)",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
              }}
            />
          ))}

          {cycleDays.map((day, idx) => {
            const dateStr = formatDateToISO(day);
            const dayCounts = contagemDiaria[dateStr] || {};
            const count = dayCounts[key] || 0;

            // Variáveis do dia
            const f = dayCounts.F || 0;
            const a = dayCounts.A || 0;
            const x = dayCounts.X || 0;
            const e = dayCounts.E || 0;

            // Verificações
            const isDeficit = (f + a) > (x + e);
            const isExcesso = (x + e) > 10;

            // Função para definir o fundo
            const getBgColor = (theme: any) => {
              // Prioriza mostrar o déficit (vermelho) se ambas as condições acontecerem
              if (isDeficit) {
                return theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)";
              }
              // Caso contrário, mostra o aviso de excesso (laranja/amarelo)
              if (isExcesso) {
                return theme.palette.mode === "dark" ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)";
              }
              return theme.palette.mode === "dark" ? "#111827" : "#fff";
            };

            return (
              <TableCell
                key={idx}
                align="center"
                sx={{
                  borderRight: "1px solid",
                  borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  bgcolor: (theme) => getBgColor(theme),
                }}
              >
                {count > 0 ? (
                  <Typography variant="body2" sx={{ fontWeight: 800, color }}>
                    {count * 12}
                  </Typography>
                ) : (
                  <Typography sx={{ fontSize: "14px", color: "text.disabled" }}>—</Typography>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}

/**
 * Tabela principal de plantão, agrupada por setor/locação.
 */
export default function ScheduleTable({ forms, cycleDays, onCellClick, onHoursChange, contagemDiaria }: ScheduleTableProps) {
  const sectorGroups = groupFormsBySector(forms);
  const totalColumns = 6 + cycleDays.length;

  const totalXE = contagemDiaria ? contagemDiaria.totalPlantoes + contagemDiaria.totalExtras : 0;
  const totalFA = contagemDiaria ? contagemDiaria.totalFerias + contagemDiaria.totalAusentes : 0;
  const alertaGeral = contagemDiaria?.alertaAusencias ?? false;

  // Processa dias com DÉFICIT de efetivo (F+A > X+E)
  const diasComDeficit = cycleDays.filter((day) => {
    if (!contagemDiaria?.porDia) return false;
    const dateStr = formatDateToISO(day);
    const count = contagemDiaria.porDia[dateStr] || {};
    const f = count.F || 0;
    const a = count.A || 0;
    const x = count.X || 0;
    const e = count.E || 0;
    return (f + a) > (x + e);
  });
  const hasDeficitDiario = diasComDeficit.length > 0;

  // Processa dias com EXCESSO de efetivo (X+E > 10)
  const diasComExcesso = cycleDays.filter((day) => {
    if (!contagemDiaria?.porDia) return false;
    const dateStr = formatDateToISO(day);
    const count = contagemDiaria.porDia[dateStr] || {};
    const x = count.X || 0;
    const e = count.E || 0;
    return (x + e) > 10;
  });
  const hasExcessoDiario = diasComExcesso.length > 0;

  return (
    <>
      {/* 🔴 ALERTA DE DÉFICIT (Erro) */}
      {(alertaGeral || hasDeficitDiario) && (
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}
        >
          <AlertTitle sx={{ fontWeight: 800 }}>Atenção: Risco de Efetivo</AlertTitle>
          {alertaGeral && (
            <Box>A soma total no período de Férias + Ausências ({totalFA * 12}h) é maior que Plantão + Extra ({totalXE * 12}h).</Box>
          )}
          {hasDeficitDiario && (
            <Box sx={{ mt: alertaGeral ? 1 : 0 }}>
              <strong>Dias com déficit (F+A &gt; X+E):</strong>{" "}
              {diasComDeficit.map(d => `${getDayHeader(d).dayNum}/${getDayHeader(d).monthName}`).join(", ")}.
              (Destacados em vermelho no Resumo Geral).
            </Box>
          )}
        </Alert>
      )}

      {/* 🟡 ALERTA DE EXCESSO (Aviso) */}
      {hasExcessoDiario && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}
        >
          <AlertTitle sx={{ fontWeight: 800 }}>Aviso: Excesso de Plantões</AlertTitle>
          <Box>
            <strong>Dias com mais de 10 Plantões/Extras (X+E &gt; 10):</strong>{" "}
            {diasComExcesso.map(d => `${getDayHeader(d).dayNum}/${getDayHeader(d).monthName}`).join(", ")}.
            (Destacados em amarelo no Resumo Geral).
          </Box>
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          overflow: "hidden",
          position: "relative",
          "&::after": {
            content: '""',
            display: { xs: "block", md: "none" },
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "16px",
            pointerEvents: "none",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(to left, rgba(0,0,0,0.35), transparent)"
                : "linear-gradient(to left, rgba(0,0,0,0.12), transparent)",
          },
        }}
      >
        <TableContainer sx={{ maxHeight: "68vh" }}>
          <Table stickyHeader size="small" aria-label="schedule grid">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, zIndex: 10, left: 0, position: "sticky", background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: { xs: "150px", sm: "200px" }, borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  Funcionário
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "70px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  Contrato
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  <Tooltip title="Plantão 12h (X)" enterTouchDelay={0} leaveTouchDelay={2500}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#3b82f6", cursor: "help" }}>X</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  <Tooltip title="Plantão Extra (E)" enterTouchDelay={0} leaveTouchDelay={2500}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#8b5cf6", cursor: "help" }}>E</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  <Tooltip title="Férias (F)" enterTouchDelay={0} leaveTouchDelay={2500}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#10b981", cursor: "help" }}>F</Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                  <Tooltip title="Ausência (A)" enterTouchDelay={0} leaveTouchDelay={2500}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#ef4444", cursor: "help" }}>A</Typography>
                  </Tooltip>
                </TableCell>
                {cycleDays.map((day, idx) => {
                  const { dayNum, monthName, weekDayName, isWeekend } = getDayHeader(day);
                  return (
                    <TableCell key={idx} align="center" sx={{ p: 1, zIndex: 5, minWidth: { xs: "44px", sm: "48px" }, fontWeight: 700, bgcolor: (theme) => isWeekend ? (theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc") : (theme.palette.mode === "dark" ? "#111827" : "#f1f5f9"), borderRight: "1px solid", borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <Box sx={{ fontSize: "12px", color: "text.primary" }}>{dayNum}</Box>
                      <Box sx={{ fontSize: "9px", color: "text.secondary", textTransform: "uppercase" }}>{weekDayName}</Box>
                      <Box sx={{ fontSize: "9px", color: "primary.main", fontWeight: "normal" }}>{monthName}</Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {sectorGroups.map((group) => (
                <React.Fragment key={group.sector}>
                  <SectorHeaderRow sector={group.sector} colSpan={totalColumns} />
                  {group.forms.map((form) => (
                    <EmployeeRow key={form.id} form={form} cycleDays={cycleDays} onCellClick={onCellClick} onHoursChange={onHoursChange} />
                  ))}
                </React.Fragment>
              ))}

              {contagemDiaria && (
                <DailySummaryRows cycleDays={cycleDays} contagemDiaria={contagemDiaria.porDia} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}