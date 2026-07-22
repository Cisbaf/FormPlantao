import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { MARK_COLORS, DEFAULT_MARK_COLOR } from "@/lib/constants";

/**
 * Legenda exibindo todas as marcações disponíveis com suas respectivas cores.
 * Inclui nota sobre marcação dupla para funcionários 24h.
 */
export default function ScheduleLegend() {
  return (
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

      {/* Informação sobre marcação dupla (24h) */}
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
          <strong>Funcionários 24h:</strong> A marca pode conter até 2 caracteres.
          A primeira letra corresponde ao 1º plantão e a segunda ao 2º plantão do dia.
          Ex: <Chip label="PA" size="small" sx={{ mx: 0.5, fontSize: "11px", height: 20, bgcolor: "#3b82f6", color: "#fff", fontWeight: "bold" }} /> = Trabalho no 1º plantão + Ausência no 2º.
        </Typography>
      </Box>
    </Paper>
  );
}
