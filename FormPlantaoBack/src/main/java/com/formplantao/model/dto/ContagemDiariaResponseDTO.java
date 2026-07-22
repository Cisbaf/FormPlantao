package com.formplantao.model.dto;

import java.time.LocalDate;
import java.util.Map;

/**
 * Resposta da contagem diária de marcações do ciclo (16 a 15), incluindo
 * os totais agregados do período inteiro e um alerta caso a soma de
 * Férias/Folga + Ausências ultrapasse a soma de Plantão + Plantão Extra.
 */
public record ContagemDiariaResponseDTO(
        Map<LocalDate, Map<Character, Integer>> porDia,
        Long totalPlantoes,
        Long totalExtras,
        Long totalFerias,
        Long totalAusentes,
        boolean alertaAusencias
) {
    public static ContagemDiariaResponseDTO of(Map<LocalDate, Map<Character, Integer>> porDia) {
        long totalX = 0L, totalE = 0L, totalF = 0L, totalA = 0L;

        for (Map<Character, Integer> contagem : porDia.values()) {
            totalX += contagem.getOrDefault('X', 0);
            totalE += contagem.getOrDefault('E', 0);
            totalF += contagem.getOrDefault('F', 0);
            totalA += contagem.getOrDefault('A', 0);
        }

        boolean alerta = (totalF + totalA) > (totalX + totalE);

        return new ContagemDiariaResponseDTO(porDia, totalX, totalE, totalF, totalA, alerta);
    }
}
