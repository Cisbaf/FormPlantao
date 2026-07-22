import {
  AccessTime,
  AddCircleOutlineOutlined,
  AssessmentOutlined,
  BeachAccess,
  Domain,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
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

export const CORES = {
  plantoes: "#3b82f6",
  extras: "#22c55e",
  ferias: "#0ea5e9",
  ausentes: "#ef4444",
};

export interface LocacaoResumo {
  locacao: string;
  totalPlantoes: number;
  totalExtras: number;
  totalFerias: number;
  totalAusentes: number;
}

export interface TotaisGerais {
  plantoes: number;
  extras: number;
  ferias: number;
  ausentes: number;
}

interface RelatoriosGraficosProps {
  locacoesResumo: LocacaoResumo[];
  totaisGerais: TotaisGerais;
}

export function RelatoriosGraficos({ locacoesResumo, totaisGerais }: RelatoriosGraficosProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardBg = isDark ? "rgba(17, 24, 39, 0.4)" : "#fff";

  const kpis = [
    {
      label: "Total Horas Contratadas",
      value: totaisGerais.plantoes,
      color: CORES.plantoes,
      icon: <AccessTime />,
    },
    {
      label: "Total Extras",
      value: totaisGerais.extras,
      color: CORES.extras,
      icon: <AddCircleOutlineOutlined />,
    },
    {
      label: "Total Férias/Folga",
      value: totaisGerais.ferias,
      color: CORES.ferias,
      icon: <BeachAccess />,
    },
    {
      label: "Total Faltas",
      value: totaisGerais.ausentes,
      color: CORES.ausentes,
      icon: <ErrorOutlineOutlined />,
    },
  ];

  const pieData = [
    { name: "Plantões 12h", value: totaisGerais.plantoes, color: CORES.plantoes },
    { name: "Extras", value: totaisGerais.extras, color: CORES.extras },
    { name: "Férias/Folga", value: totaisGerais.ferias, color: CORES.ferias },
    { name: "Faltas", value: totaisGerais.ausentes, color: CORES.ausentes },
  ].filter((d) => d.value > 0);

  const barData = locacoesResumo.map((loc) => ({
    locacao: loc.locacao,
    Plantoes: loc.totalPlantoes,
    Extras: loc.totalExtras,
    Férias: loc.totalFerias,
    Faltas: loc.totalAusentes,
  }));

  return (
    <>
      {/* KPIS GERAIS */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {kpis.map((kpi, idx) => (
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
              <Box
                sx={{
                  display: "flex",
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: `${kpi.color}15`,
                  color: kpi.color,
                }}
              >
                {kpi.icon}
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {kpi.value * 12}h
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {kpi.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* GRÁFICOS */}
      {locacoesResumo.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: cardBorder,
                background: cardBg,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
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
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${cardBorder}`,
                      background: isDark ? "#1f2937" : "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: cardBorder,
                background: cardBg,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Domain color="primary" /> Desempenho por Locação
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barGap={2} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={cardBorder} vertical={false} />
                  <XAxis
                    dataKey="locacao"
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                  <RechartsTooltip
                    cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${cardBorder}`,
                      background: isDark ? "#1f2937" : "#fff",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="Plantoes" stackId="a" fill={CORES.plantoes} radius={[0, 0, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Extras" stackId="a" fill={CORES.extras} radius={[0, 0, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Férias" stackId="a" fill={CORES.ferias} radius={[0, 0, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Faltas" stackId="a" fill={CORES.ausentes} radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
}
