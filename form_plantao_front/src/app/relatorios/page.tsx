"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  AccessTime,
  AddCircleOutlineOutlined,
  BeachAccess,
  Domain,
  ErrorOutlineOutlined,
  Person,
  AssessmentOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// ⚠️ Ajuste este caminho de importação conforme a estrutura do seu projeto
import { fetchFormularios, fetchRelatorioGeral } from "@/lib/api";

const CORES = {
  completas: "#3b82f6",
  extras: "#22c55e",
  ferias: "#0ea5e9",
  ausentes: "#ef4444",
};

interface LocacaoResumo {
  locacao: string;
  totalCompletas: number;
  totalExtras: number;
  totalFerias: number;
  totalAusentes: number;
}

interface FuncionarioDetalhado {
  nomeFuncionario: string;
  matricula: string | number;
  locacao: string;
  horasDia: number;
  horasCompletas: number;
  horasExtras: number;
  horasFerias: number;
  horasAusentes: number;
}

// Componente auxiliar para os painéis das Abas (Tabs)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RelatoriosPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardBg = isDark ? "rgba(17, 24, 39, 0.4)" : "#fff";
  const headBg = isDark ? "#111827" : "#f8fafc";

  const [loading, setLoading] = useState(true);
  const [locacoesResumo, setLocacoesResumo] = useState<LocacaoResumo[]>([]);
  const [funcionariosDetalhado, setFuncionariosDetalhado] = useState<FuncionarioDetalhado[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const [mesReferencia, setMesReferencia] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const dadosFormularios = await fetchFormularios();

        const funcionariosMapeados = dadosFormularios
          .filter((f) => {
            let formMes = "";
            if (Array.isArray(f.dataReferencia)) {
              formMes = `${f.dataReferencia[0]}-${String(f.dataReferencia[1]).padStart(2, "0")}`;
            } else {
              formMes = f.dataReferencia;
            }
            return formMes === mesReferencia;
          })
          .map((f) => ({
            nomeFuncionario: f.funcionario.nome,
            matricula: f.funcionario.matricula,
            horasDia: f.horas,
            locacao: f.funcionario.locacao,
            horasCompletas: f.horasTotais?.horasCompletas || 0,
            horasExtras: f.horasTotais?.horasExtras || 0,
            horasFerias: f.horasTotais?.horasFerias || 0,
            horasAusentes: f.horasTotais?.horasAusentes || 0,
          }));

        setFuncionariosDetalhado(funcionariosMapeados);

        try {
          const dadosLocacao = await fetchRelatorioGeral(mesReferencia);
          if (Array.isArray(dadosLocacao) && dadosLocacao.length > 0) {
            const locacoesMapeadas: LocacaoResumo[] = dadosLocacao.map((item) => ({
              locacao: item.locacao,
              totalCompletas: item.totalCompletas ?? 0, // Ajustado caso a API mande 'completas' e não 'totalCompletas'
              totalExtras: item.totalExtras ?? 0,
              totalFerias: item.totalFerias ?? 0,
              totalAusentes: item.totalAusentes ?? 0,
            }));
            setLocacoesResumo(locacoesMapeadas);
          } else {
            throw new Error("API retornou vazio.");
          }
        } catch (apiError) {
          const agrupadoPorLocacao = funcionariosMapeados.reduce((acc, func) => {
            if (!acc[func.locacao]) {
              acc[func.locacao] = { locacao: func.locacao, totalCompletas: 0, totalExtras: 0, totalFerias: 0, totalAusentes: 0 };
            }
            acc[func.locacao].totalCompletas += func.horasCompletas;
            acc[func.locacao].totalExtras += func.horasExtras;
            acc[func.locacao].totalFerias += func.horasFerias;
            acc[func.locacao].totalAusentes += func.horasAusentes;
            return acc;
          }, {} as Record<string, LocacaoResumo>);

          setLocacoesResumo(Object.values(agrupadoPorLocacao));
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [mesReferencia]);

  const totaisGerais = locacoesResumo.reduce(
    (acc, loc) => {
      acc.completas += loc.totalCompletas;
      acc.extras += loc.totalExtras;
      acc.ferias += loc.totalFerias;
      acc.ausentes += loc.totalAusentes;
      return acc;
    },
    { completas: 0, extras: 0, ferias: 0, ausentes: 0 }
  );

  const pieData = [
    { name: "Completas", value: totaisGerais.completas, color: CORES.completas },
    { name: "Extras", value: totaisGerais.extras, color: CORES.extras },
    { name: "Férias/Folga", value: totaisGerais.ferias, color: CORES.ferias },
    { name: "Faltas", value: totaisGerais.ausentes, color: CORES.ausentes },
  ].filter((d) => d.value > 0);

  const barData = locacoesResumo.map((loc) => ({
    locacao: loc.locacao,
    Completas: loc.totalCompletas,
    Extras: loc.totalExtras,
    Férias: loc.totalFerias,
    Faltas: loc.totalAusentes,
  }));

  return (
    <DashboardLayout>
      {/* CABEÇALHO */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "primary.main" }}>
            Relatório Mensal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visão consolidada de horas e plantões por locação e funcionário.
          </Typography>
        </Box>

        <TextField
          type="month"
          label="Mês de Referência"
          value={mesReferencia}
          onChange={(e) => setMesReferencia(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          size="small"
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* NOVA SEÇÃO: KPIs GERAIS (Total do Mês) */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: "Total Completas", value: totaisGerais.completas, color: CORES.completas, icon: <AccessTime /> },
              { label: "Total Extras", value: totaisGerais.extras, color: CORES.extras, icon: <AddCircleOutlineOutlined /> },
              { label: "Total Férias/Folga", value: totaisGerais.ferias, color: CORES.ferias, icon: <BeachAccess /> },
              { label: "Total Faltas", value: totaisGerais.ausentes, color: CORES.ausentes, icon: <ErrorOutlineOutlined /> },
            ].map((kpi, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: cardBorder,
                    background: cardBg,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", p: 1.5, borderRadius: "8px", bgcolor: `${kpi.color}15`, color: kpi.color }}>
                    {kpi.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{kpi.value}h</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{kpi.label}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* SEÇÃO DE GRÁFICOS */}
          {locacoesResumo.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: "16px", border: "1px solid", borderColor: cardBorder, background: cardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <AssessmentOutlined color="primary" /> Proporção Geral
                  </Typography>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: 12, border: `1px solid ${cardBorder}`, background: isDark ? "#1f2937" : "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: "16px", border: "1px solid", borderColor: cardBorder, background: cardBg }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Domain color="primary" /> Desempenho por Locação
                  </Typography>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData} barGap={2} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={cardBorder} vertical={false} />
                      <XAxis dataKey="locacao" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} interval={0} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                      <RechartsTooltip cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: 12, border: `1px solid ${cardBorder}`, background: isDark ? "#1f2937" : "#fff" }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Bar dataKey="Completas" stackId="a" fill={CORES.completas} radius={[0, 0, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Extras" stackId="a" fill={CORES.extras} radius={[0, 0, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Férias" stackId="a" fill={CORES.ferias} radius={[0, 0, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Faltas" stackId="a" fill={CORES.ausentes} radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* SEÇÃO DE TABELAS (USANDO ABAS PARA LIMPAR A TELA) */}
          <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: cardBorder, overflow: "hidden", background: cardBg }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 1, background: headBg }}>
              <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                <Tab icon={<Domain fontSize="small" />} iconPosition="start" label="Resumo por Locação" sx={{ fontWeight: 700, textTransform: 'none' }} />
                <Tab icon={<Person fontSize="small" />} iconPosition="start" label="Detalhamento por Funcionário" sx={{ fontWeight: 700, textTransform: 'none' }} />
              </Tabs>
            </Box>

            {/* ABA 1: TABELA DE LOCAÇÕES (Substitui os Cards antigos) */}
            <CustomTabPanel value={tabValue} index={0}>
              <TableContainer sx={{ maxHeight: "50vh" }}>
                <Table stickyHeader size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, background: headBg }}>Locação</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Completas</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Extras</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Férias/Folgas</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Faltas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {locacoesResumo.length === 0 ? (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>Nenhum dado encontrado.</TableCell></TableRow>
                    ) : (
                      locacoesResumo.map((loc, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{loc.locacao}</TableCell>
                          <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{loc.totalCompletas}h</Typography></TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: loc.totalExtras > 0 ? "success.main" : "text.disabled" }}>
                              {loc.totalExtras > 0 ? `+${loc.totalExtras}h` : "0h"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: loc.totalFerias > 0 ? "info.main" : "text.disabled" }}>
                              {loc.totalFerias}h
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: loc.totalAusentes > 0 ? "error.main" : "text.disabled" }}>
                              {loc.totalAusentes}h
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>

            {/* ABA 2: TABELA DE FUNCIONÁRIOS (Existente) */}
            <CustomTabPanel value={tabValue} index={1}>
              <TableContainer sx={{ maxHeight: "50vh" }}>
                <Table stickyHeader size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, background: headBg }}>Funcionário</TableCell>
                      <TableCell sx={{ fontWeight: 800, background: headBg }}>Horas Dia</TableCell>
                      <TableCell sx={{ fontWeight: 800, background: headBg }}>Locação</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Horas</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Extras</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Férias</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Faltas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {funcionariosDetalhado.length === 0 ? (
                      <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3, color: "text.secondary" }}>Nenhum funcionário encontrado.</TableCell></TableRow>
                    ) : (
                      funcionariosDetalhado.map((func, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: "13px", fontWeight: "bold", bgcolor: "primary.main" }}>
                                {func.nomeFuncionario.substring(0, 2).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{func.nomeFuncionario}</Typography>
                                <Typography variant="caption" color="text.secondary">Mat: {func.matricula}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell><Chip label={func.horasDia} size="small" variant="outlined" color="primary" /></TableCell>

                          <TableCell><Chip label={func.locacao} size="small" variant="outlined" color="primary" /></TableCell>
                          <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{func.horasCompletas}h</Typography></TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: func.horasExtras > 0 ? "success.main" : "text.disabled" }}>
                              {func.horasExtras}h
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: func.horasFerias > 0 ? "info.main" : "text.disabled" }}>
                              {func.horasFerias}h
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: func.horasAusentes > 0 ? "error.main" : "text.disabled" }}>
                              {func.horasAusentes}h
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
          </Paper>
        </>
      )}
    </DashboardLayout>
  );
}