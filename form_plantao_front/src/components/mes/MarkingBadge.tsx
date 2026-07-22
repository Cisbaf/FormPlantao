import React from "react";
import { Box } from "@mui/material";
import { getMarkColor } from "@/lib/utils";

interface MarkingCellProps {
  marca: string;
}

/**
 * Renderiza o badge visual de uma marcação dentro de uma célula da tabela.
 * Suporta 1 ou 2 caracteres. Para 2 caracteres, exibe ambos lado a lado
 * com a cor de cada marcação individual.
 */
export default function MarkingBadge({ marca }: MarkingCellProps) {
  if (!marca) {
    return (
      <Box sx={{ color: "text.disabled", fontSize: "12px" }}>-</Box>
    );
  }

  // Marca com 1 caractere — exibe badge simples
  if (marca.length === 1) {
    const color = getMarkColor(marca);
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 800,
          bgcolor: color.bg,
          color: color.text,
          mx: "auto",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca}
      </Box>
    );
  }

  // Marca com 2 caracteres (funcionário 24h) — exibe dois badges lado a lado
  const color1 = getMarkColor(marca[0]);
  const color2 = getMarkColor(marca[1]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px",
        justifyContent: "center",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 28,
          borderRadius: "4px 0 0 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 800,
          bgcolor: color1.bg,
          color: color1.text,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca[0]}
      </Box>
      <Box
        sx={{
          width: 18,
          height: 28,
          borderRadius: "0 4px 4px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 800,
          bgcolor: color2.bg,
          color: color2.text,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {marca[1]}
      </Box>
    </Box>
  );
}
