"use client";

import DashboardLayout from "@/components/home/DashboardLayout";
import { MarkingDialog, ScheduleHeader, ScheduleLegend, ScheduleTable } from "@/components/mes";
import { fetchContagemDiaria, fetchFormulariosPorDataReferencia, parseLocalDate, updateFormulario } from "@/lib/api";
import { ContagemDiariaResponse, EditingCell, FormularioUnico } from "@/lib/types";
import { formatDateToISO, getDaysInCycle, parseYearMonth } from "@/lib/utils";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function MesDetailPage({ params }: { params: Promise<{ yearMonth: string }> }) {
  const router = useRouter();
  const { yearMonth } = use(params);

  const [formularios, setFormularios] = useState<FormularioUnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [contagemDiaria, setContagemDiaria] = useState<ContagemDiariaResponse | null>(null);

  const monthInfo = parseYearMonth(yearMonth);
  const cycleDays = getDaysInCycle(yearMonth);

  // Modificamos a função para aceitar um parâmetro "showSpinner"
  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const [data, contagem] = await Promise.all([
        fetchFormulariosPorDataReferencia(yearMonth),
        fetchContagemDiaria(yearMonth),
      ]);
      setFormularios(data);
      setContagemDiaria(contagem);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao carregar dados dos plantões do mês de referência.");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  // Carrega com spinner apenas quando o mês da URL muda (montagem inicial)
  useEffect(() => {
    loadData(true);
  }, [yearMonth]);

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

  const handleHoursChange = async (form: FormularioUnico, newHoras: number) => {
    try {
      await updateFormulario(form.id!, { horas: newHoras });
      // Atualiza os dados em segundo plano (false) sem piscar a tela
      await loadData(false);
    } catch (err) {
      console.error("Erro ao atualizar horas:", err);
    }
  };

  // Filtrar formulários pela busca (nome, matrícula ou setor)
  const filteredForms = formularios.filter((f) => {
    const text = `${f.funcionario.nome} ${f.funcionario.locacao} ${f.funcionario.matricula}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    // Se o usuário clicar no botão de recarregar do layout, mostramos o spinner (true)
    <DashboardLayout onRefresh={() => loadData(true)}>
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
            p: 3, textAlign: "center", borderRadius: "16px",
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
          onHoursChange={handleHoursChange}
          contagemDiaria={contagemDiaria}
        />
      )}

      {/* Modal de Marcação */}
      <MarkingDialog
        editingCell={editingCell}
        onClose={() => setEditingCell(null)}
        onSaved={async () => {
          setEditingCell(null); // Fecha o modal imediatamente para resposta rápida na UI
          await loadData(false); // Atualiza a tabela silenciosamente por trás das cortinas
        }}
      />
    </DashboardLayout>
  );
}