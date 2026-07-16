"use client";

import React, { useState, useEffect } from "react";
import { Typography, Button, Box, CircularProgress, Paper, Alert, Snackbar } from "@mui/material";
import { CalendarMonth, InfoOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { deleteByDataReferencia, fetchFormularios } from "@/lib/api";
import { FormularioUnico } from "@/lib/types";
import { groupFormulariosByMonth } from "@/lib/utils";
import DashboardLayout from "@/components/DashboardLayout";
import MonthCard from "@/components/home/MonthCard";

export default function Home() {
  const router = useRouter();
  const [formularios, setFormularios] = useState<FormularioUnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [mesesEscondidos, setMesesEscondidos] = useState<string[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFormularios();
      setFormularios(data);
    } catch (err: any) {
      console.error(err);
      setError(
        "Não foi possível conectar ao servidor backend (localhost:8080). Certifique-se de que a aplicação Spring Boot está em execução e de que o banco de dados está online."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const groupedMonths = groupFormulariosByMonth(formularios);

  const handleDeleteMonth = async (dataReferencia: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja deletar TODOS os formulários do mês ${dataReferencia}? Esta ação não pode ser desfeita.`
    );

    if (!confirmar) return;

    try {
      await deleteByDataReferencia(dataReferencia);

      setToast({
        open: true,
        message: "Mês deletado com sucesso!",
        severity: "success"
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: "Erro ao deletar os formulários do mês.",
        severity: "error"
      });
    }
  };

  return (
    <DashboardLayout onRefresh={() => setRefreshTrigger((prev) => prev + 1)}>
      {/* Intro section */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(90deg, #6366f1, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Painel de Frequência de Plantões
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecione um mês de referência para visualizar, editar ou adicionar as marcações de plantão.
        </Typography>
      </Box>

      {/* Info Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 4, borderRadius: "16px",
          border: "1px dashed", borderColor: "primary.main",
          bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.03)",
          display: "flex", gap: 2, alignItems: "flex-start",
        }}
      >
        <InfoOutlined color="primary" sx={{ mt: 0.3 }} />
        <Box>
          <Typography variant="subtitle1" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
            Regra de Ciclo de Plantão (16 a 15)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O ciclo de trabalho de cada mês de referência inicia no <strong>dia 16 do mês anterior</strong> e termina no <strong>dia 15 do mês atual</strong>.
            Por exemplo, o mês de <strong>Julho/2026</strong> compreende as marcações de <strong>16 de Junho de 2026</strong> a <strong>15 de Julho de 2026</strong>.
            As marcações são salvas e validadas automaticamente pelo backend com base nessa regra de negócios.
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 4, borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)" }}
          action={<Button color="inherit" size="small" onClick={loadData}>Tentar Novamente</Button>}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : formularios.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6, textAlign: "center", borderRadius: "20px",
            border: "1px solid",
            borderColor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(17,24,27,0.2)" : "rgba(255,255,255,0.6)",
          }}
        >
          <CalendarMonth sx={{ fontSize: 60, color: "text.secondary", mb: 2, opacity: 0.6 }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            Nenhum Formulário Encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", mb: 3 }}>
            Para começar, crie um <strong>Funcionário</strong> usando o botão no cabeçalho e, em seguida, crie um <strong>Formulário de Frequência</strong> selecionando o funcionário criado e o mês de referência.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
          {groupedMonths.filter(group => !mesesEscondidos.includes(group.label)).map((group) => (
            <MonthCard
              key={group.yearMonth}
              group={group}
              onClick={() => router.push(`/mes/${group.yearMonth}`)}
              onDelete={() => handleDeleteMonth(group.yearMonth)} />
          ))}
        </Box>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%", borderRadius: "8px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
