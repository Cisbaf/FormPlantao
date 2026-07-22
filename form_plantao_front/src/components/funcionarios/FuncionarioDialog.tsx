"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { createFuncionario, updateFuncionario, Funcionario } from "@/lib/api";

interface FuncionarioDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
    funcionarioSelecionado?: Funcionario | null;
}

export default function FuncionarioDialog({
    open,
    onClose,
    onSuccess,
    onError,
    funcionarioSelecionado
}: FuncionarioDialogProps) {
    const [nome, setNome] = useState("");
    const [matricula, setMatricula] = useState("");
    const [locacao, setLocacao] = useState("");

    useEffect(() => {
        if (open) {
            if (funcionarioSelecionado) {
                setNome(funcionarioSelecionado.nome);
                setMatricula(funcionarioSelecionado.matricula.toString());
                setLocacao(funcionarioSelecionado.locacao);
            } else {
                setNome("");
                setMatricula("");
                setLocacao("");
            }
        }
    }, [funcionarioSelecionado, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !matricula || !locacao) {
            onError("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            if (funcionarioSelecionado && funcionarioSelecionado.id) {
                await updateFuncionario(funcionarioSelecionado.id, {
                    nome,
                    matricula: parseInt(matricula, 10),
                    locacao,
                });
                onSuccess("Funcionário atualizado com sucesso!");
            } else {
                await createFuncionario({
                    nome,
                    matricula: parseInt(matricula, 10),
                    locacao,
                });
                onSuccess("Funcionário cadastrado com sucesso!");
            }
            onClose();
        } catch (error) {
            onError(funcionarioSelecionado ? "Erro ao atualizar funcionário" : "Erro ao cadastrar funcionário");
        }
    };

    const isEditMode = !!funcionarioSelecionado;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {isEditMode ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
                </DialogTitle>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    <TextField
                        label="Nome Completo"
                        variant="outlined"
                        fullWidth
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 50 } }}
                    />
                    <TextField
                        label="Matrícula"
                        variant="outlined"
                        type="text"
                        fullWidth
                        required
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value.replace(/\D/g, ''))}
                        slotProps={{ htmlInput: { maxLength: 15, inputMode: 'numeric' } }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="locacao_dialog">Locação / Setor</InputLabel>
                        <Select
                            labelId="locacao_dialog"
                            label="Locação / Setor"
                            variant="outlined"
                            required
                            value={locacao}
                            onChange={(e) => setLocacao(e.target.value)}
                        >
                            <MenuItem value={"CISBAF"}>CISBAF</MenuItem>
                            <MenuItem value={"NOVA IGUAÇU"}>NOVA IGUAÇU</MenuItem>
                            <MenuItem value={"MAGÉ"}>MAGÉ</MenuItem>
                            <MenuItem value={"JAPERI"}>JAPERI</MenuItem>
                            <MenuItem value={"ITAGUAÍ"}>ITAGUAÍ</MenuItem>
                            <MenuItem value={"SEROPÉDICA"}>SEROPÉDICA</MenuItem>
                            <MenuItem value={"PARACAMBI"}>PARACAMBI</MenuItem>
                            <MenuItem value={"BELFORD ROXO"}>BELFORD ROXO</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" color={isEditMode ? "primary" : "secondary"}>
                        {isEditMode ? "Salvar Alterações" : "Salvar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
