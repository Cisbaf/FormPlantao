// src/app/funcionarios/page.tsx
"use client";

import DashboardLayout from "@/components/home/DashboardLayout";
import { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert,
    CircularProgress, Tooltip,
    TextField
} from "@mui/material";
import { Edit, Delete, Badge, LocationOn, Person, Search } from "@mui/icons-material";
import { fetchFuncionarios, deleteFuncionario, Funcionario } from "@/lib/api";
import { FuncionarioDialog } from "@/components/funcionarios";


export default function FuncionariosPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Estados do Modal de Edição
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [funcionarioEditando, setFuncionarioEditando] = useState<Funcionario | null>(null);

    // Feedback (Toast)
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    // Buscar os dados
    const loadDados = async () => {
        setLoading(true);
        try {
            const data = await fetchFuncionarios();
            setFuncionarios(data);
        } catch (error) {
            console.error(error);
            setToast({ open: true, message: "Erro ao carregar funcionários", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDados();
    }, [refreshTrigger]);

    // Lógica de Deletar
    const handleDelete = async (id: number, nomeFunci: string) => {
        const confirmar = window.confirm(`Tem certeza que deseja deletar o funcionário ${nomeFunci}?`);
        if (!confirmar) return;

        try {
            await deleteFuncionario(id);
            setToast({ open: true, message: "Funcionário deletado com sucesso!", severity: "success" });
            setRefreshTrigger((prev) => prev + 1); // Recarrega a tabela
        } catch (error) {
            setToast({ open: true, message: "Erro ao deletar funcionário.", severity: "error" });
        }
    };

    // Abrir modal de edição
    const handleOpenEdit = (funci: Funcionario) => {
        setFuncionarioEditando(funci);
        setEditModalOpen(true);
    };

    const filter = funcionarios.filter((f) => {
        const entrada = `${f.nome} ${f.locacao} ${f.matricula}`.toLowerCase();
        return entrada.includes(searchTerm.toLowerCase());
    })

    return (
        <DashboardLayout onRefresh={() => setRefreshTrigger((prev) => prev + 1)}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#6366f1" }} >
                    Gerenciar Funcionários
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Visualize, edite ou remova funcionários do sistema.
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", width: { xs: "100%", md: "auto" }, pb: "10px", }}>
                <Search fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />

                <TextField fullWidth placeholder="Buscar funcionário ou locação..." variant="standard" onChange={(e) => setSearchTerm(e.target.value)} ></TextField>

            </Box>

            <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", elevation: 3 }}>
                <TableContainer sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader aria-label="Tabela de funcionários">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Matrícula</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Locação</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : funcionarios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">Nenhum funcionário cadastrado.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filter.filter(f => f.nome != "Todos").map((funci) => (
                                    <TableRow hover key={funci.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Person color="primary" fontSize="small" />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{funci.nome}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Badge color="action" fontSize="small" />
                                                <Typography variant="body2">{funci.matricula}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOn color="error" fontSize="small" />
                                                <Typography variant="body2">{funci.locacao}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                <Tooltip title="Editar">
                                                    <IconButton color="primary" onClick={() => handleOpenEdit(funci)}>
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton color="error" onClick={() => handleDelete(funci.id!, funci.nome)}>
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal de Edição delegado ao componente externo */}
            <FuncionarioDialog
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setFuncionarioEditando(null); // Limpa o estado ao fechar
                }}
                onSuccess={(msg) => {
                    setToast({ open: true, message: msg, severity: "success" });
                    setRefreshTrigger((prev) => prev + 1); // Força o refresh da tabela
                }}
                onError={(msg) => {
                    setToast({ open: true, message: msg, severity: "error" });
                }}
                funcionarioSelecionado={funcionarioEditando}
            />

            {/* Feedback Visual */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: "100%", borderRadius: "8px" }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </DashboardLayout>
    );
}