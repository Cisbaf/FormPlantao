import { Domain, Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { LocacaoResumo } from "./RelatoriosGraficos";

export interface FuncionarioDetalhado {
  nomeFuncionario: string;
  matricula: string | number;
  locacao: string;
  horasDia: number;
  horasPlantoes: number;
  horasExtras: number;
  horasFerias: number;
  horasAusentes: number;
}

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

interface RelatoriosTabelasProps {
  locacoesResumo: LocacaoResumo[];
  funcionariosDetalhado: FuncionarioDetalhado[];
}

export function RelatoriosTabelas({ locacoesResumo, funcionariosDetalhado }: RelatoriosTabelasProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardBg = isDark ? "rgba(17, 24, 39, 0.4)" : "#fff";
  const headBg = isDark ? "#111827" : "#f8fafc";

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: cardBorder,
        overflow: "hidden",
        background: cardBg,
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 1, background: headBg }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab
            icon={<Domain fontSize="small" />}
            iconPosition="start"
            label="Resumo por Locação"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
          <Tab
            icon={<Person fontSize="small" />}
            iconPosition="start"
            label="Detalhamento por Funcionário"
            sx={{ fontWeight: 700, textTransform: "none" }}
          />
        </Tabs>
      </Box>

      {/* ABA 1: TABELA DE LOCAÇÕES */}
      <CustomTabPanel value={tabValue} index={0}>
        <TableContainer sx={{ maxHeight: "50vh" }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, background: headBg }}>Locação</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Plantoes 12H</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Extras</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Férias/Folgas</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Faltas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locacoesResumo.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                locacoesResumo.map((loc, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>{loc.locacao}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {loc.totalPlantoes * 12}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: loc.totalExtras > 0 ? "success.main" : "text.disabled" }}
                      >
                        {loc.totalExtras > 0 ? `+${loc.totalExtras * 12}h` : "0h"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: loc.totalFerias > 0 ? "info.main" : "text.disabled" }}
                      >
                        {loc.totalFerias * 12}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: loc.totalAusentes > 0 ? "error.main" : "text.disabled" }}
                      >
                        {loc.totalAusentes * 12}h
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CustomTabPanel>

      {/* ABA 2: TABELA DE FUNCIONÁRIOS */}
      <CustomTabPanel value={tabValue} index={1}>
        <TableContainer sx={{ maxHeight: "50vh" }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, background: headBg }}>Funcionário</TableCell>
                <TableCell sx={{ fontWeight: 800, background: headBg }}>Horas Dia</TableCell>
                <TableCell sx={{ fontWeight: 800, background: headBg }}>Locação</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Plantões 12h</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Extras</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Férias</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, background: headBg }}>Faltas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funcionariosDetalhado.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    Nenhum funcionário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                funcionariosDetalhado.map((func, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: "13px", fontWeight: "bold", bgcolor: "primary.main" }}>
                          {func.nomeFuncionario.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {func.nomeFuncionario}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mat: {func.matricula}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={func.horasDia} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip label={func.locacao} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {func.horasPlantoes * 12}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: func.horasExtras > 0 ? "success.main" : "text.disabled" }}
                      >
                        {func.horasExtras > 0 ? `+${func.horasExtras * 12}h` : "0h"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: func.horasFerias > 0 ? "info.main" : "text.disabled" }}
                      >
                        {func.horasFerias * 12}h
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: func.horasAusentes > 0 ? "error.main" : "text.disabled" }}
                      >
                        {func.horasAusentes * 12}h
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
  );
}
