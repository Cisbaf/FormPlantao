import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";

interface RelatoriosHeaderProps {
  mesReferencia: string;
  setMesReferencia: (mes: string) => void;
  mesesDisponiveis: string[];
}

export function RelatoriosHeader({
  mesReferencia,
  setMesReferencia,
  mesesDisponiveis,
}: RelatoriosHeaderProps) {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, color: "primary.main" }}>
          Relatório Mensal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão consolidada de horas e plantões por locação e funcionário.
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="mes-select-label">Mês de Referência</InputLabel>
        <Select
          labelId="mes-select-label"
          value={mesReferencia}
          label="Mês de Referência"
          onChange={(e) => setMesReferencia(e.target.value as string)}
        >
          {mesesDisponiveis.map((mes) => (
            <MenuItem key={mes} value={mes}>
              {mes}
            </MenuItem>
          ))}
          {!mesesDisponiveis.includes(mesReferencia) && (
            <MenuItem key={mesReferencia} value={mesReferencia}>
              {mesReferencia}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
