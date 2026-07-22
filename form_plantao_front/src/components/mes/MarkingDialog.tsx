import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { EditingCell } from "@/lib/types";
import { updateMarcacao, createMarcacao } from "@/lib/api";
import { MARCA_MAX_LENGTH, MARK_COLORS } from "@/lib/constants";

interface MarkingDialogProps {
  editingCell: EditingCell | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Dialog para criar ou editar uma marcação de plantão.
 * Suporta marcação de 1 ou 2 caracteres:
 * - 12h: 1 letra (ex: "T")
 * - 24h: até 2 letras (ex: "TF" = Trabalho + Folga)
 */
export default function MarkingDialog({ editingCell, onClose, onSaved }: MarkingDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedMarca1, setSelectedMarca1] = useState("");
  const [selectedMarca2, setSelectedMarca2] = useState("");
  const [customMarca, setCustomMarca] = useState("");
  const [useSecondShift, setUseSecondShift] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sincroniza estado quando editingCell muda
  useEffect(() => {
    if (!editingCell) return;

    const existing = editingCell.existingMarking;
    if (existing) {
      const marca = existing.marca;
      if (marca.length === 2) {
        // Marca dupla (24h)
        setUseSecondShift(true);
        const first = marca[0];
        const second = marca[1];
        if (Object.keys(MARK_COLORS).includes(first)) {
          setSelectedMarca1(first);
        } else {
          setSelectedMarca1("CUSTOM");
          setCustomMarca(first);
        }
        if (Object.keys(MARK_COLORS).includes(second)) {
          setSelectedMarca2(second);
        } else {
          setSelectedMarca2(second);
        }
      } else {
        // Marca simples (12h)
        setUseSecondShift(false);
        setSelectedMarca2("");
        if (Object.keys(MARK_COLORS).includes(marca)) {
          setSelectedMarca1(marca);
          setCustomMarca("");
        } else {
          setSelectedMarca1("CUSTOM");
          setCustomMarca(marca);
        }
      }
    } else {
      setSelectedMarca1("");
      setSelectedMarca2("");
      setCustomMarca("");
      setUseSecondShift(false);
    }
  }, [editingCell]);

  useEffect(() => {
    setSelectedMarca1("");
    setSelectedMarca2("");
    setCustomMarca("");
    setUseSecondShift(false);
  }, [onClose])


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;

    // Monta a marca final
    let marca1 = selectedMarca1 === "CUSTOM" ? customMarca.toUpperCase() : selectedMarca1;

    // if (!marca1 || marca1.length !== 1) {
    //   alert("A marca do 1º plantão deve conter exatamente 1 caractere.");
    //   return;
    // }

    let finalMarca = marca1;

    if (useSecondShift) {
      // if (!selectedMarca2 || selectedMarca2.length !== 1) {
      //   alert("Selecione a marca do 2º plantão (1 caractere).");
      //   return;
      // }
      finalMarca = marca1 + selectedMarca2;
    }

    if (finalMarca.length > MARCA_MAX_LENGTH) {
      alert(`A marca deve ter no máximo ${MARCA_MAX_LENGTH} caracteres.`);
      return;
    }

    setSubmitting(true);

    try {
      if (editingCell.existingMarking?.id) {
        await updateMarcacao(editingCell.existingMarking.id, {
          id: editingCell.existingMarking.id,
          dataMarcada: editingCell.dateStr,
          marca: finalMarca,
          formId: editingCell.form.id!,
        });
      } else {
        await createMarcacao({
          dataMarcada: editingCell.dateStr,
          marca: finalMarca,
          formId: editingCell.form.id!,
        });
      }

      onSaved();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar marcação. Verifique se a data está no intervalo de ciclo permitido (dia 16 ao 15).");
    } finally {
      setSubmitting(false);
    }
  };

  const markOptions = Object.entries(MARK_COLORS);

  return (
    <Dialog open={!!editingCell} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      {editingCell && (
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>Marcação de Plantão</DialogTitle>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            {/* Info do funcionário */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                Funcionário:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {editingCell.form.funcionario.nome}
              </Typography>
              <Chip
                label={editingCell.form.funcionario.locacao}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, borderRadius: "6px" }}
              />
            </Box>

            {/* Data selecionada */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                Data Selecionada:
              </Typography>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
                {editingCell.date.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>

            <Divider />

            {/* 1º Plantão */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                {useSecondShift ? "1º Plantão" : "Tipo de Marcação"}
              </FormLabel>
              <RadioGroup
                aria-label="marca1"
                name="marca1"
                value={selectedMarca1}
                onChange={(e) => setSelectedMarca1(e.target.value)}
              >
                {markOptions.map(([key, config]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "4px",
                            bgcolor: config.bg,
                          }}
                        />
                        {config.label}
                      </Box>
                    }
                  />
                ))}
                {markOptions && (
                  <FormControlLabel
                    key={"desmarcar"}
                    value=""
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "4px",
                            border: "2px solid",
                            borderColor: (theme) => theme.palette.mode === "dark" ? "white" : "black",
                          }}
                        />
                        Desmarcar
                      </Box>}
                  />
                )}

                <FormControlLabel
                  value="CUSTOM"
                  control={<Radio size="small" />}
                  label="Personalizado (1 letra)"
                />
              </RadioGroup>
            </FormControl>

            {selectedMarca1 === "CUSTOM" && (
              <TextField
                label="Código Personalizado (1 caractere)"
                variant="outlined"
                required
                value={customMarca}
                onChange={(e) => setCustomMarca(e.target.value.substring(0, 1))}
                slotProps={{
                  htmlInput: {
                    maxLength: 1,
                    style: { textTransform: "uppercase" },
                  },
                }}
                helperText="Ex: M (Meio-período), N (Noturno), etc."
              />
            )}

            <Divider />

            {/* Toggle 2º Plantão (24h) */}
            <Box>
              <Button
                variant={useSecondShift ? "contained" : "outlined"}
                color="secondary"
                size="small"
                onClick={() => {
                  setUseSecondShift(!useSecondShift);

                }}
                fullWidth
                sx={{ borderRadius: "8px", "@media (min-width:600px)": { width: "auto" } }}
              >
                {useSecondShift ? "✓ 2º Plantão Ativado (24h)" : "+ Adicionar 2º Plantão (24h)"}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Ative se o funcionário é 24h e precisa de marcação para dois turnos no mesmo dia.
              </Typography>
            </Box>
            {editingCell.form.horas >= 24 && (
              <></>
            )}

            {/*  (se ativo) */}
            {useSecondShift && (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                  2º Plantão
                </FormLabel>
                <RadioGroup
                  aria-label="marca2"
                  name="marca2"
                  value={selectedMarca2}
                  onChange={(e) => setSelectedMarca2(e.target.value)}
                >

                  {editingCell.form.horas >= 24 &&
                    markOptions.map(([key, config]) => (
                      <FormControlLabel
                        key={key}
                        value={key}
                        control={<Radio size="small" />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "4px",
                                bgcolor: config.bg,
                              }}
                            />

                            {config.label}
                          </Box>
                        }
                      />
                    ))}
                  {editingCell.form.horas <= 12 && (
                    <FormControlLabel
                      key={"extra"}
                      value="E"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "4px",
                              bgcolor: "#8b5cf6"
                            }}
                          />
                          Plantão Extra 12 Horas (E)
                        </Box>}
                    />

                  )}


                  <FormControlLabel
                    key={"desmarcar"}
                    value=""
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "4px",
                            border: "2px solid",
                            borderColor: (theme) => theme.palette.mode === "dark" ? "white" : "black",
                          }}
                        />
                        Desmarcar
                      </Box>}
                  />
                </RadioGroup>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
