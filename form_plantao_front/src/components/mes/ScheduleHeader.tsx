import { ArrowBack, Search } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MARK_COLORS, DEFAULT_MARK_COLOR } from "@/lib/constants";

interface ScheduleHeaderProps {
  monthLabel: string;
  yearMonth: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
}

export function ScheduleHeader({
  monthLabel,
  yearMonth,
  searchTerm,
  onSearchChange,
  onBack,
}: ScheduleHeaderProps) {
  const parts = yearMonth.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const prevMonthDate = new Date(year, month - 2, 1);
  const prevMonthName = prevMonthDate.toLocaleDateString("pt-BR", { month: "long" });

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" color="inherit" underline="hover">
          Início
        </Link>
        <Typography color="text.primary">{monthLabel}</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: "10px" }}
          >
            Voltar
          </Button>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Folha Mensal: {monthLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Período: 16 de {prevMonthName} a 15 de {monthLabel}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", md: "auto" },
            border: "1px solid",
            borderColor: (theme: any) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
            borderRadius: "12px",
            px: 2,
            py: 0.5,
            bgcolor: (theme: any) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#fff",
          }}
        >
          <Search fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />
          <TextField
            placeholder="Buscar funcionário ou locação..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{ input: { disableUnderline: true } }}
          />
        </Box>
      </Box>

      {/* LEGENDA DE MARCAÇÕES */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(17, 24, 39, 0.5)" : "#fff",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
          Legenda de Marcações de Frequência:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
          {Object.entries(MARK_COLORS).map(([key, config]) => (
            <Chip
              key={key}
              label={config.label}
              size="small"
              sx={{
                bgcolor: config.bg,
                color: config.text,
                fontWeight: "bold",
                borderRadius: "6px",
              }}
            />
          ))}
          <Chip
            label="Outro (Personalizado)"
            size="small"
            sx={{
              bgcolor: DEFAULT_MARK_COLOR.bg,
              color: DEFAULT_MARK_COLOR.text,
              fontWeight: "bold",
              borderRadius: "6px",
            }}
          />
          <Chip
            label="- (Vazio / Sem Plantão)"
            variant="outlined"
            size="small"
            sx={{ borderRadius: "6px" }}
          />
        </Box>

        <Box
          sx={{
            mt: 1,
            p: 1.5,
            borderRadius: "8px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.08)" : "rgba(99, 102, 241, 0.04)",
            border: "1px dashed",
            borderColor: "primary.main",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            <strong>Funcionários 24h:</strong> A marca pode conter até 2 caracteres. A primeira letra
            corresponde ao 1º plantão e a segunda ao 2º plantão do dia. Ex:{" "}
            <Chip
              label="PA"
              size="small"
              sx={{
                mx: 0.5,
                fontSize: "11px",
                height: 20,
                bgcolor: "#3b82f6",
                color: "#fff",
                fontWeight: "bold",
              }}
            />{" "}
            = Trabalho no 1º plantão + Ausência no 2º.
          </Typography>
        </Box>
      </Paper>
    </>
  );
}

export function ScheduleLegend() {
  return null;
}

export default ScheduleHeader;
