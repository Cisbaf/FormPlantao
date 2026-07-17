package com.formplantao.model.dto;

public record RelatorioLocacaoDTO(
        String locacao,
        Long totalPlantoes,
        Long totalExtras,
        Long totalFerias,
        Long totalAusentes
) {}