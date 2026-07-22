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
      {/* Nome do funcionário (sticky) */}
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

      {/* Horas com Menu Dropdown */}
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

      {/* Totais de horas / plantões */}
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#3b82f6" }}>{form.horasTotais?.horasPlantoes !== undefined ? form.horasTotais?.horasPlantoes * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#8b5cf6" }}>{form.horasTotais?.horasExtras !== undefined ? form.horasTotais?.horasExtras * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#10b981" }}>{form.horasTotais?.horasFerias !== undefined ? form.horasTotais?.horasFerias * 12 : 0}</TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#ef4444" }}>{form.horasTotais?.horasAusentes !== undefined ? form.horasTotais?.horasAusentes * 12 : 0}</TableCell>

      {/* Células de marcação */}
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

/** Configuração para gerar as linhas individuais de resumo final */
const SUMMARY_ROWS = [
  { key: "X", label: "Total Plantão Ordinário", color: "#3b82f6" },
  { key: "E", label: "Total Plantão Extra", color: "#8b5cf6" },
  { key: "F", label: "Total Férias", color: "#10b981" },
  { key: "A", label: "Total Ausências", color: "#ef4444" },
];

/** Componente que renderiza as 4 linhas de totais como se fossem funcionários */
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
          {/* Label usando o visual de funcionário */}
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

          {/* Colunas vazias no meio da tabela para alinhar o layout */}
          {[0, 1, 2, 3, 4].map((i) => (
            <TableCell
              key={`empty-${i}`}
              sx={{
                borderRight: "1px solid rgba(224,224,224,0.3)",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
              }}
            />
          ))}

          {/* Renderização do valor nos dias correspondentes */}
          {cycleDays.map((day, idx) => {
            const dateStr = formatDateToISO(day);
            const count = contagemDiaria[dateStr]?.[key] || 0;

            return (
              <TableCell
                key={idx}
                align="center"
                sx={{
                  borderRight: "1px solid",
                  borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
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

      {/* Linha extra: soma X + E por dia */}
      {/* <TableRow hover sx={{ "&:hover td": { bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" } }}>
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
            <Avatar sx={{ width: 32, height: 32, fontSize: "13px", fontWeight: "bold", bgcolor: "#f59e0b", color: "#fff" }}>
              PG
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#f59e0b" }}>Total Plantões no Geral</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Métricas Diárias
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {[0, 1, 2, 3, 4].map((i) => (
          <TableCell
            key={`empty-sum-${i}`}
            sx={{
              borderRight: "1px solid rgba(224,224,224,0.3)",
              bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
            }}
          />
        ))}

        {cycleDays.map((day, idx) => {
          const dateStr = formatDateToISO(day);
          const x = contagemDiaria[dateStr]?.["X"] || 0;
          const e = contagemDiaria[dateStr]?.["E"] || 0;
          const somaXE = x + e;

          return (
            <TableCell
              key={idx}
              align="center"
              sx={{
                borderRight: "1px solid",
                borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                bgcolor: (theme) => theme.palette.mode === "dark" ? "#111827" : "#fff",
              }}
            >
              {somaXE > 0 ? (
                <Typography variant="body2" sx={{ fontWeight: 800, color: "#f59e0b" }}>
                  {somaXE * 12}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ fontWeight: 400, color: "rgba(0, 0, 0, 0.38)" }}>
                  —
                </Typography>
              )

              }

            </TableCell>
          );
        })}
      </TableRow> */}
    </>
  );
}

/**
 * Tabela principal de plantão, agrupada por setor/locação.
 */
export default function ScheduleTable({ forms, cycleDays, onCellClick, onHoursChange, contagemDiaria }: ScheduleTableProps) {
  const sectorGroups = groupFormsBySector(forms);
  const totalColumns = 6 + cycleDays.length; // Nome + Contrato + X + E + F + A + dias

  const totalXE = contagemDiaria ? contagemDiaria.totalPlantoes + contagemDiaria.totalExtras : 0;
  const totalFA = contagemDiaria ? contagemDiaria.totalFerias + contagemDiaria.totalAusentes : 0;
  const alertaGeral = contagemDiaria?.alertaAusencias ?? false;

  return (
    <>
      {alertaGeral && (
        <Alert
          severity="error"
          icon={<WarningAmberIcon />}
          sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}
        >
          <AlertTitle sx={{ fontWeight: 800 }}>Atenção: Ausências acima do previsto</AlertTitle>
          A soma de Férias + Ausências ({totalFA * 12} horas) é maior que a soma de Plantão + Plantão Extra ({totalXE * 12} horas) no período.
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

              {/* Novas 4 Linhas de Resumo (Substituiu a antiga DailySummaryRow) */}
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