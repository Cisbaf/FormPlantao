"use client";

import DashboardLayout from "@/components/home/DashboardLayout";
import {
  FuncionarioDetalhado,
  LocacaoResumo,
  RelatoriosGraficos,
  RelatoriosHeader,
  RelatoriosTabelas,
} from "@/components/relatorios";
import { fetchFormularios, fetchRelatorioGeral } from "@/lib/api";
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(true);
  const [locacoesResumo, setLocacoesResumo] = useState<LocacaoResumo[]>([]);
  const [funcionariosDetalhado, setFuncionariosDetalhado] = useState<FuncionarioDetalhado[]>([]);
  const [mesesDisponiveis, setMesesDisponiveis] = useState<string[]>([]);

  const [mesReferencia, setMesReferencia] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const dadosFormularios = await fetchFormularios();

        const funcionariosMapeados = dadosFormularios
          .filter((f) => {
            let formMes = "";
            if (Array.isArray(f.dataReferencia)) {
              formMes = `${f.dataReferencia[0]}-${String(f.dataReferencia[1]).padStart(2, "0")}`;
            } else {
              formMes = f.dataReferencia;
            }
            return formMes === mesReferencia;
          })
          .map((f) => ({
            nomeFuncionario: f.funcionario.nome,
            matricula: f.funcionario.matricula,
            horasDia: f.horas,
            locacao: f.funcionario.locacao,
            horasPlantoes: f.horasTotais?.horasPlantoes || 0,
            horasExtras: f.horasTotais?.horasExtras || 0,
            horasFerias: f.horasTotais?.horasFerias || 0,
            horasAusentes: f.horasTotais?.horasAusentes || 0,
          }));

        setFuncionariosDetalhado(funcionariosMapeados);

        try {
          const dadosLocacao = await fetchRelatorioGeral(mesReferencia);
          if (Array.isArray(dadosLocacao) && dadosLocacao.length > 0) {
            const locacoesMapeadas: LocacaoResumo[] = dadosLocacao.map((item) => ({
              locacao: item.locacao,
              totalPlantoes: item.totalPlantoes ?? 0,
              totalExtras: item.totalExtras ?? 0,
              totalFerias: item.totalFerias ?? 0,
              totalAusentes: item.totalAusentes ?? 0,
            }));
            setLocacoesResumo(locacoesMapeadas);
          } else {
            throw new Error("API retornou vazio.");
          }
        } catch (apiError) {
          const agrupadoPorLocacao = funcionariosMapeados.reduce((acc, func) => {
            if (!acc[func.locacao]) {
              acc[func.locacao] = {
                locacao: func.locacao,
                totalPlantoes: 0,
                totalExtras: 0,
                totalFerias: 0,
                totalAusentes: 0,
              };
            }
            acc[func.locacao].totalPlantoes += func.horasPlantoes;
            acc[func.locacao].totalExtras += func.horasExtras;
            acc[func.locacao].totalFerias += func.horasFerias;
            acc[func.locacao].totalAusentes += func.horasAusentes;
            return acc;
          }, {} as Record<string, LocacaoResumo>);

          setLocacoesResumo(Object.values(agrupadoPorLocacao));
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [mesReferencia]);

  useEffect(() => {
    const carregarMesesDisponiveis = async () => {
      try {
        const dadosFormularios = await fetchFormularios();
        const mesesUnicos = Array.from(
          new Set(
            dadosFormularios.map((f) =>
              Array.isArray(f.dataReferencia)
                ? `${f.dataReferencia[0]}-${String(f.dataReferencia[1]).padStart(2, "0")}`
                : f.dataReferencia
            )
          )
        ).sort((a, b) => (a < b ? 1 : -1));
        setMesesDisponiveis(mesesUnicos);
      } catch (error) {
        console.error("Erro ao carregar meses disponíveis:", error);
      }
    };
    carregarMesesDisponiveis();
  }, []);

  const totaisGerais = locacoesResumo.reduce(
    (acc, loc) => {
      acc.plantoes += loc.totalPlantoes;
      acc.extras += loc.totalExtras;
      acc.ferias += loc.totalFerias;
      acc.ausentes += loc.totalAusentes;
      return acc;
    },
    { plantoes: 0, extras: 0, ferias: 0, ausentes: 0 }
  );

  return (
    <DashboardLayout>
      <RelatoriosHeader
        mesReferencia={mesReferencia}
        setMesReferencia={setMesReferencia}
        mesesDisponiveis={mesesDisponiveis}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <RelatoriosGraficos locacoesResumo={locacoesResumo} totaisGerais={totaisGerais} />
          <RelatoriosTabelas locacoesResumo={locacoesResumo} funcionariosDetalhado={funcionariosDetalhado} />
        </>
      )}
    </DashboardLayout>
  );
}