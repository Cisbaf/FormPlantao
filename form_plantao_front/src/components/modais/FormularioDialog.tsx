"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { createFormulario, fetchFuncionarios, Funcionario } from "@/lib/api";

interface FormularioDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export default function FormularioDialog({ open, onClose, onSuccess, onError }: FormularioDialogProps) {
    const [horas, setHoras] = useState("24");
    const [dataReferencia, setDataReferencia] = useState("2026-07");
    const [funcionarioId, setFuncionarioId] = useState<number | "">("");
    const [funcionariosList, setFuncionariosList] = useState<Funcionario[]>([]);

    useEffect(() => {
        if (open) {
            fetchFuncionarios()
                .then((data) => setFuncionariosList(data))
                .catch((err) => console.error("Erro ao carregar funcionários", err));
        }
    }, [open]);

    const handleCreateFormulario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!horas || !dataReferencia || !funcionarioId) {
            onError("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            await createFormulario({
                horas: parseInt(horas, 10),
                dataReferencia, // O backend espera o formato YYYY-MM
                funcionarioId: Number(funcionarioId),
                marcacoesId: [],
            });
            onSuccess("Formulário criado com sucesso!");
            setHoras("24");
            setFuncionarioId("");
            onClose();
        } catch (error) {
            onError("Erro ao criar formulário");
        }
    };

    const funcionarioTodos = funcionariosList.find((f) => f.nome.trim().toLowerCase() === "todos");
    const outrosFuncionarios = funcionariosList.filter((f) => f.nome.trim().toLowerCase() !== "todos");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
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
                            {funcionarioTodos && [
                                <MenuItem key={funcionarioTodos.id} value={funcionarioTodos.id} sx={{ fontWeight: "bold", color: "primary.main" }}>
                                    {funcionarioTodos.nome}
                                </MenuItem>,
                                <Divider key="divider" />,
                            ]}

                            {outrosFuncionarios.map((f) => (
                                <MenuItem key={f.id} value={f.id}>
                                    {f.nome} (Matrícula: {f.matricula})
                                </MenuItem>
                            ))}

                            {funcionariosList.length === 0 && (
                                <MenuItem disabled>Nenhum funcionário cadastrado. Crie um primeiro!</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {funcionarioTodos?.id != funcionarioId && (
                        <FormControl fullWidth>
                            <InputLabel id="horario_plantao">Carga Horária</InputLabel>
                            <Select
                                labelId="horario_plantao"
                                label="Carga Horária"
                                variant="outlined"
                                required
                                value={horas}
                                onChange={(e) => setHoras(e.target.value)}
                            >
                                <MenuItem value={12}>12h</MenuItem>
                                <MenuItem value={24}>24h</MenuItem>
                            </Select>
                        </FormControl>
                    )}



                    <DatePicker
                        label="Mês de Referência"
                        format="MM/YYYY"
                        views={["year", "month"]}
                        value={dataReferencia ? dayjs(dataReferencia, "YYYY-MM") : null}
                        onChange={(newValue) => {
                            setDataReferencia(newValue ? newValue.format("YYYY-MM") : "");
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                                variant: "outlined",
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Criar Formulário
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}