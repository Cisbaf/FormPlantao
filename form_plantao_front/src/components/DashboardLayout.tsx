"use client";

import { useColorMode } from "@/app/providers";
import { createFormulario, createFuncionario, fetchFuncionarios, Funcionario } from "@/lib/api";
import {
  Brightness4,
  Brightness7,
  NoteAdd,
  PersonAdd
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { red, yellow } from '@mui/material/colors';
interface DashboardLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
}

export default function DashboardLayout({ children, onRefresh }: DashboardLayoutProps) {
  const colorMode = useColorMode();
  const router = useRouter();

  // Dialog States
  const [openFuncionario, setOpenFuncionario] = useState(false);
  const [openFormulario, setOpenFormulario] = useState(false);

  // Funcionario Form State
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [locacao, setLocacao] = useState("");

  // Formulario Form State
  const [horas, setHoras] = useState("24");
  const [dataReferencia, setDataReferencia] = useState("2026-07");
  const [funcionarioId, setFuncionarioId] = useState<number | "">("");
  const [funcionariosList, setFuncionariosList] = useState<Funcionario[]>([]);

  // Feedback State
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Load employees for selection
  const loadFuncionarios = async () => {
    try {
      const data = await fetchFuncionarios();
      setFuncionariosList(data);
    } catch (error) {
      console.error("Erro ao carregar funcionários", error);
    }
  };

  useEffect(() => {
    if (openFormulario) {
      loadFuncionarios();
    }
  }, [openFormulario]);

  const handleCreateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !matricula || !locacao) {
      setToast({ open: true, message: "Preencha todos os campos obrigatórios", severity: "error" });
      return;
    }
    try {
      await createFuncionario({
        nome,
        matricula: parseInt(matricula, 10),
        locacao,
      });
      setToast({ open: true, message: "Funcionário cadastrado com sucesso!", severity: "success" });
      setOpenFuncionario(false);
      setNome("");
      setMatricula("");
      setLocacao("");
      if (onRefresh) onRefresh();
    } catch (error) {
      setToast({ open: true, message: "Erro ao cadastrar funcionário", severity: "error" });
    }
  };

  const handleCreateFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horas || !dataReferencia || !funcionarioId) {
      setToast({ open: true, message: "Preencha todos os campos obrigatórios", severity: "error" });
      return;
    }
    try {
      await createFormulario({
        horas: parseInt(horas, 10),
        dataReferencia, // backend expects format YYYY-MM
        funcionarioId: Number(funcionarioId),
        marcacoesId: [],
      });
      setToast({ open: true, message: "Formulário criado com sucesso!", severity: "success" });
      setOpenFormulario(false);
      setHoras("24");
      setFuncionarioId("");
      if (onRefresh) onRefresh();
      router.refresh();
    } catch (error) {
      setToast({ open: true, message: "Erro ao criar formulário", severity: "error" });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(17, 24, 39, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box
              onClick={() => router.push("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/cisbaf.png" alt="Logo Cisbaf" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
              </Box>
              <Stack direction="column" spacing={0} sx={{ alignItems: 'flex-start' }}>

                <Typography
                  sx={(theme) => ({
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 900,
                    color: theme.palette.mode === 'dark' ? red[400] : red[700],
                    letterSpacing: '-0.025em',
                  })}
                >
                  Protocolo Cisbaf
                </Typography>

                <Typography
                  sx={(theme) => ({
                    fontSize: { xs: '0.625rem', md: '0.75rem' },
                    fontWeight: 'bold',
                    color: theme.palette.mode === 'dark' ? yellow[400] : yellow[700],
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  })}
                >
                  Painel de Frequência de Plantões
                </Typography>

              </Stack>

            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<PersonAdd />}
                onClick={() => setOpenFuncionario(true)}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Novo Funcionário
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<NoteAdd />}
                onClick={() => setOpenFormulario(true)}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Novo Formulário
              </Button>

              {/* Mobile quick icons */}
              <Tooltip title="Novo Funcionário">
                <IconButton
                  color="secondary"
                  onClick={() => setOpenFuncionario(true)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                >
                  <PersonAdd />
                </IconButton>
              </Tooltip>
              <Tooltip title="Novo Formulário">
                <IconButton
                  color="primary"
                  onClick={() => setOpenFormulario(true)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                >
                  <NoteAdd />
                </IconButton>
              </Tooltip>

              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                <Brightness4 sx={{ display: "none", ".dark &": { display: "inline-block" } }} />
                <Brightness7 sx={{ display: "inline-block", ".dark &": { display: "none" } }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          textAlign: "center",
          borderTop: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(10, 15, 30, 0.4)" : "rgba(240, 240, 240, 0.4)",
        }}
      >

      </Box>

      {/* Dialog: Novo Funcionário */}
      <Dialog open={openFuncionario} onClose={() => setOpenFuncionario(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleCreateFuncionario}>
          <DialogTitle sx={{ fontWeight: 700 }}>Cadastrar Novo Funcionário</DialogTitle>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                }
              }}
            />
            <TextField
              label="Matrícula"
              variant="outlined"
              type="text"
              fullWidth
              required
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ''))}
              slotProps={{
                htmlInput: {
                  maxLength: 15,
                  inputMode: 'numeric',
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="locacao_funci">Locação / Setor</InputLabel>
              <Select
                labelId="locacao_funci"
                label="Locação / Setor"
                variant="outlined"
                required
                value={locacao}
                onChange={(e) => setLocacao(e.target.value)}
              >
                <MenuItem value={"CISBAF"}>CISBAF</MenuItem>
                <MenuItem value={"NOVA IGUAÇU"}>NOVA IGUAÇU</MenuItem>
                <MenuItem value={"MAGÉ"}>MAGÉ</MenuItem>
                <MenuItem value={"JAPERI"}>JAPERI</MenuItem>
                <MenuItem value={"ITAGUAÍ"}>ITAGUAÍ</MenuItem>
                <MenuItem value={"SEROPÉDICA"}>SEROPÉDICA</MenuItem>
                <MenuItem value={"PARACAMBI"}>PARACAMBI</MenuItem>
                <MenuItem value={"BELFORD ROXO"}>BELFORD ROXO</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenFuncionario(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="secondary">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Novo Formulário */}
      <Dialog open={openFormulario} onClose={() => setOpenFormulario(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleCreateFormulario}>
          <DialogTitle sx={{ fontWeight: 700 }}>Criar Novo Formulário de Frequência</DialogTitle>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel id="funcionario-select-label">Funcionário</InputLabel>
              <Select
                labelId="funcionario-select-label"
                value={funcionarioId}
                label="Funcionário"
                onChange={(e) => setFuncionarioId(e.target.value as number)}
              >
                {funcionariosList.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.nome} (Matrícula: {f.matricula})
                  </MenuItem>
                ))}
                {funcionariosList.length === 0 && (
                  <MenuItem disabled>
                    Nenhum funcionário cadastrado. Crie um primeiro!
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="horario_plantao">Carga Horária Mensal (Horas)</InputLabel>
              <Select
                labelId="horario_plantao"
                label="Carga Horária Mensal (Horas)"
                variant="outlined"
                required
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
              >
                <MenuItem value={12}>12h</MenuItem>
                <MenuItem value={24}>24h</MenuItem>
              </Select>
            </FormControl>



            <DatePicker
              label="Mês de Referência"
              format="MM/YYYY"
              views={['year', 'month']} // Força a selecionar apenas o mês/ano
              value={dataReferencia ? dayjs(dataReferencia, "YYYY-MM") : null}
              onChange={(newValue) => {
                // newValue é um objeto Day.js
                if (newValue) {
                  setDataReferencia(newValue.format("YYYY-MM"));
                } else {
                  setDataReferencia("");
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  variant: "outlined",
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenFormulario(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Criar Formulário
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Toast Notification */}
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
    </Box>
  );
}
