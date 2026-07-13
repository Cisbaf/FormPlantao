"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // Começa como dark por padrão
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // 1. Ao carregar a tela, verifica se há um tema salvo no localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as "light" | "dark" | null;

    if (savedMode) {
      setMode(savedMode);
    } else {
      // Opcional: Se não tiver nada salvo, puxa a preferência do sistema operacional
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }

    setMounted(true);
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === "light" ? "dark" : "light";
          // 2. Salva a nova escolha no localStorage toda vez que alterar
          localStorage.setItem("themeMode", nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#6366f1" : "#4f46e5",
          },
          secondary: {
            main: mode === "dark" ? "#10b981" : "#059669",
          },
          background: {
            default: mode === "dark" ? "#0b0f19" : "#f8fafc",
            paper: mode === "dark" ? "#111827" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f3f4f6" : "#1e293b",
            secondary: mode === "dark" ? "#9ca3af" : "#64748b",
          },
        },
        typography: {
          fontFamily: "var(--font-geist-sans), sans-serif",
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  if (!mounted) {
    return <div style={{ opacity: 0 }}>{children}</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}