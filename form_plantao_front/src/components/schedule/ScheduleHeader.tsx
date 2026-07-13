import React from "react";
import {
  Box, Typography, Button, Breadcrumbs, Link, TextField,
} from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";

interface ScheduleHeaderProps {
  monthLabel: string;
  yearMonth: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
}

export default function ScheduleHeader({
  monthLabel, yearMonth, searchTerm, onSearchChange, onBack,
}: ScheduleHeaderProps) {
  const parts = yearMonth.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const prevMonthDate = new Date(year, month - 2, 1);
  const prevMonthName = prevMonthDate.toLocaleDateString("pt-BR", { month: "long" });

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" color="inherit" underline="hover">Início</Link>
        <Typography color="text.primary">{monthLabel}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" onClick={onBack} startIcon={<ArrowBack />} sx={{ borderRadius: "10px" }}>Voltar</Button>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Folha Mensal: {monthLabel}</Typography>
            <Typography variant="body2" color="text.secondary">Período: 16 de {prevMonthName} a 15 de {monthLabel}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", width: { xs: "100%", md: "auto" }, border: "1px solid", borderColor: (theme: any) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)", borderRadius: "12px", px: 2, py: 0.5, bgcolor: (theme: any) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#fff" }}>
          <Search fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
          <TextField placeholder="Buscar funcionário ou setor..." variant="standard" fullWidth value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} slotProps={{ input: { disableUnderline: true } }} />
        </Box>
      </Box>
    </>
  );
}
