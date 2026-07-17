import { parseLocalDate } from "@/lib/api";
import { FormularioUnico } from "@/lib/types";
import { formatDateToISO, getDayHeader, groupFormsBySector } from "@/lib/utils";
import {
  Avatar,
  Box,
  Chip, Menu, MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import MarkingBadge from "./MarkingBadge";

interface ScheduleTableProps {
  forms: FormularioUnico[];
  cycleDays: Date[];
  onCellClick: (form: FormularioUnico, day: Date) => void;
  onHoursChange?: (form: FormularioUnico, newHoras: number) => void;
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
  // Controle do Menu de seleção de horas
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
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={() => handleSelectHour(12)} selected={form.horas === 12}>
            12 horas
          </MenuItem>
          <MenuItem onClick={() => handleSelectHour(24)} selected={form.horas === 24}>
            24 horas
          </MenuItem>
        </Menu>
      </TableCell>

      {/* Totais de horas / plantões */}
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#3b82f6" }}>
        {form.horasTotais?.horasPlantoes ?? 0}
      </TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#8b5cf6" }}>
        {form.horasTotais?.horasExtras ?? 0}
      </TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#10b981" }}>
        {form.horasTotais?.horasFerias ?? 0}
      </TableCell>
      <TableCell align="center" sx={{ borderRight: "1px solid rgba(224,224,224,0.3)", fontWeight: 700, color: "#ef4444" }}>
        {form.horasTotais?.horasAusentes ?? 0}
      </TableCell>

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

/**
 * Tabela principal de plantão, agrupada por setor/locação.
 */
export default function ScheduleTable({ forms, cycleDays, onCellClick, onHoursChange }: ScheduleTableProps) {
  const sectorGroups = groupFormsBySector(forms);
  const totalColumns = 6 + cycleDays.length; // Nome + Horas + X + E + F + A + dias

  return (
    <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "68vh" }}>
        <Table stickyHeader size="small" aria-label="schedule grid">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, zIndex: 10, left: 0, position: "sticky", background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "200px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                Funcionário
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "70px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                Horas
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                <Tooltip title="Plantão 12h (X)">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#3b82f6", cursor: "help" }}>X</Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                <Tooltip title="Plantão Extra (E)">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#8b5cf6", cursor: "help" }}>E</Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                <Tooltip title="Férias (F)">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#10b981", cursor: "help" }}>F</Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, zIndex: 5, background: (theme) => theme.palette.mode === "dark" ? "#111827" : "#f1f5f9", minWidth: "40px", borderRight: "1px solid rgba(224,224,224,0.3)" }}>
                <Tooltip title="Ausência (A)">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "#ef4444", cursor: "help" }}>A</Typography>
                </Tooltip>
              </TableCell>
              {cycleDays.map((day, idx) => {
                const { dayNum, monthName, weekDayName, isWeekend } = getDayHeader(day);
                return (
                  <TableCell key={idx} align="center" sx={{ p: 1, zIndex: 5, minWidth: "48px", fontWeight: 700, bgcolor: (theme) => isWeekend ? (theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc") : (theme.palette.mode === "dark" ? "#111827" : "#f1f5f9"), borderRight: "1px solid", borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
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
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}