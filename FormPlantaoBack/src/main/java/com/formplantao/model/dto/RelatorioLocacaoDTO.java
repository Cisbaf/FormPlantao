package com.formplantao.model.dto;

public record RelatorioLocacaoDTO(
        String locacao,
        Long totalCompletas,
        Long totalExtras,
        Long totalFerias,
        Long totalAusentes
) {}