"use client";

import React, { useState, useEffect, use } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { fetchFormularios } from "@/lib/api";
import { FormularioUnico, EditingCell } from "@/lib/types";
import { parseYearMonth, getDaysInCycle, formatDateToISO } from "@/lib/utils";
import { parseLocalDate } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { ScheduleHeader, ScheduleLegend, ScheduleTable, MarkingDialog } from "@/components/schedule";

export default function MesDetailPage({ params }: { params: Promise<{ yearMonth: string }> }) {
  const router = useRouter();
  const { yearMonth } = use(params);

  const [formularios, setFormularios] = useState<FormularioUnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const monthInfo = parseYearMonth(yearMonth);
  const cycleDays = getDaysInCycle(yearMonth);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFormularios();
      const filtered = data.filter((form) => {
        const { formatted } = parseYearMonth(form.dataReferencia);
        return formatted === yearMonth;
      });
      setFormularios(filtered);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar dados dos plantões do mês de referência.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger, yearMonth]);

  // Abrir modal ao clicar numa célula
  const handleCellClick = (form: FormularioUnico, date: Date) => {
    const dateStr = formatDateToISO(date);
    const existing = form.marcacoes?.find((m) => parseLocalDate(m.dataMarcada) === dateStr);

    setEditingCell({
      form,
      date,
      dateStr,
      existingMarking: existing,
    });
  };

  // Filtrar formulários pela busca (nome, matrícula ou setor)
  const filteredForms = formularios.filter((f) => {
    const text = `${f.funcionario.nome} ${f.funcionario.locacao} ${f.funcionario.matricula}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout onRefresh={() => setRefreshTrigger((prev) => prev + 1)}>
      <ScheduleHeader
        monthLabel={monthInfo.label}
        yearMonth={yearMonth}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onBack={() => router.push("/")}
      />

      <ScheduleLegend />

      {/* Conteúdo principal */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : formularios.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6, textAlign: "center", borderRadius: "16px",
            border: "1px solid",
            borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Nenhum formulário cadastrado para este mês de referência.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use o botão <strong>Novo Formulário</strong> no topo para adicionar funcionários neste mês.
          </Typography>
        </Paper>
      ) : (
        <ScheduleTable
          forms={filteredForms}
          cycleDays={cycleDays}
          onCellClick={handleCellClick}
        />
      )}

      {/* Modal de Marcação */}
      <MarkingDialog
        editingCell={editingCell}
        onClose={() => setEditingCell(null)}
        onSaved={async () => {
          await loadData();
          setEditingCell(null);
        }}
      />
    </DashboardLayout>
  );
}
