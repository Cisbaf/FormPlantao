"use client";

import { useColorMode } from "@/app/providers";
import {
  Assignment,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  NoteAdd,
  Person,
  PersonAdd
} from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { red, yellow } from "@mui/material/colors";
import FuncionarioDialog from "../funcionarios/FuncionarioDialog";
import FormularioDialog from "../modais/FormularioDialog";


interface DashboardLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
}

export default function DashboardLayout({ children, onRefresh }: DashboardLayoutProps) {
  const colorMode = useColorMode();
  const router = useRouter();

  // Dialog States
  const [openFuncionario, setOpenFuncionario] = useState(false);
  const [openFormulario, setOpenFormulario] = useState(false);

  // Mobile menu state
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const closeMobileMenu = () => setMobileMenuAnchor(null);

  // Feedback State
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Funções de Handler pros Modais
  const handleSuccess = (message: string) => {
    setToast({ open: true, message, severity: "success" });
    if (onRefresh) onRefresh();
    router.refresh();
  };

  const handleError = (message: string) => {
    setToast({ open: true, message, severity: "error" });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(17, 24, 39, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 1.5, md: 4 } }}>
          <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 1, minWidth: 0 }}>
            <Box
              onClick={() => router.push("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: { xs: 1, md: 2 },
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Box
                  component="img"
                  src="/cisbaf.png"
                  alt="Logo Cisbaf"
                  sx={{ height: { xs: 40, md: 60 }, width: "auto", objectFit: "contain" }}
                />
              </Box>
              <Stack direction="column" spacing={0} sx={{ alignItems: "flex-start", minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={(theme) => ({
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    fontWeight: 900,
                    color: theme.palette.mode === "dark" ? red[400] : red[700],
                    letterSpacing: "-0.025em",
                    maxWidth: "100%",
                  })}
                >
                  Protocolo Cisbaf
                </Typography>

                <Typography
                  noWrap
                  sx={(theme) => ({
                    display: { xs: "none", sm: "block" },
                    fontSize: { xs: "0.625rem", md: "0.75rem" },
                    fontWeight: "bold",
                    color: theme.palette.mode === "dark" ? yellow[400] : yellow[700],
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    maxWidth: "100%",
                  })}
                >
                  Painel de Frequência de Plantões
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 }, flexShrink: 0 }}>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                startIcon={<PersonAdd />}
                onClick={() => setOpenFuncionario(true)}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Novo Funcionário
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<NoteAdd />}
                onClick={() => setOpenFormulario(true)}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Novo Formulário
              </Button>

              <Button
                variant="contained"
                color="warning"
                size="small"
                startIcon={<Person />}
                onClick={() => router.push("/funcionarios")}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Funcionários
              </Button>

              <Button
                variant="contained"
                color="info"
                size="small"
                startIcon={<Assignment />}
                onClick={() => router.push("/relatorios")}
                sx={{ display: { xs: "none", sm: "flex" }, borderRadius: "20px" }}
              >
                Relatorio
              </Button>

              {/* Mobile menu (hamburger) grouping all actions */}
              <IconButton
                color="inherit"
                onClick={(e) => setMobileMenuAnchor(e.currentTarget)}
                sx={{ display: { xs: "flex", sm: "none" } }}
                aria-label="Abrir menu"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={mobileMenuOpen}
                onClose={closeMobileMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    closeMobileMenu();
                    setOpenFuncionario(true);
                  }}
                >
                  <ListItemIcon>
                    <PersonAdd fontSize="small" color="secondary" />
                  </ListItemIcon>
                  <ListItemText>Novo Funcionário</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMobileMenu();
                    setOpenFormulario(true);
                  }}
                >
                  <ListItemIcon>
                    <NoteAdd fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Novo Formulário</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    closeMobileMenu();
                    router.push("/funcionarios");
                  }}
                >
                  <ListItemIcon>
                    <Person fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText>Funcionários</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMobileMenu();
                    router.push("/relatorios");
                  }}
                >
                  <ListItemIcon>
                    <Assignment fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText>Relatório</ListItemText>
                </MenuItem>
              </Menu>

              <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                <Brightness4 sx={{ display: "none", ".dark &": { display: "inline-block" } }} />
                <Brightness7 sx={{ display: "inline-block", ".dark &": { display: "none" } }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 10 } }}>{children}</Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          textAlign: "center",
          borderTop: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(10, 15, 30, 0.4)" : "rgba(240, 240, 240, 0.4)",
        }}
      ></Box>

      {/* Modais */}
      <FuncionarioDialog
        open={openFuncionario}
        onClose={() => setOpenFuncionario(false)}
        onSuccess={handleSuccess}
        onError={handleError}

      />

      <FormularioDialog
        open={openFormulario}
        onClose={() => setOpenFormulario(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Toast Notification */}
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
    </Box>
  );
}