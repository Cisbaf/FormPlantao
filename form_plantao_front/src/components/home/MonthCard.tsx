import { GroupedMonth } from "@/lib/types";
import { CalendarMonth, ChevronRight, Delete, PeopleAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

interface MonthCardProps {
  group: GroupedMonth;
  onClick: () => void;
  onDelete: () => void;
}

/**
 * Card de resumo de um mês de referência na tela inicial.
 */
export default function MonthCard({ group, onClick, onDelete }: MonthCardProps) {
  // Conta setores únicos
  const uniqueSectors = new Set(group.forms.map((f) => f.funcionario.locacao));

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #111827, #0f172a)"
            : "linear-gradient(145deg, #ffffff, #f8fafc)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderRadius: "16px",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 20px -8px rgba(99, 102, 241, 0.25)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)", color: "primary.main" }}>
            <CalendarMonth />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 850 }}>{group.label}</Typography>
        </Box>

        <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
              <PeopleAlt fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Formulários</Typography>
            </Box>
            <Typography variant="h5" sx={{ mt: 0.5, color: "text.primary", fontWeight: 750 }}>{group.forms.length}</Typography>
          </Box>
        </Box>

        {/* Setores presentes */}
        {uniqueSectors.size > 0 && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {Array.from(uniqueSectors).slice(0, 4).map((sector) => (
              <Chip key={sector} label={sector} size="small" variant="outlined" sx={{ fontSize: "10px", height: 22, borderRadius: "6px" }} />
            ))}
            {uniqueSectors.size > 4 && (
              <Chip label={`+${uniqueSectors.size - 4}`} size="small" sx={{ fontSize: "10px", height: 22, borderRadius: "6px" }} />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>

        <Button color="error" onClick={onDelete} sx={{ minWidth: "auto" }}>
          <Delete />
        </Button>

        <Button size="medium" endIcon={<ChevronRight />} onClick={onClick} sx={{ borderRadius: "10px", px: 2 }}>
          Abrir Plantões
        </Button>

      </CardActions>
    </Card>
  );
}
