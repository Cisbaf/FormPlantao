package com.formplantao.model.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.time.YearMonth;
import java.util.List;

@Builder
public record FormularioDTO(
        Long id,
        @NotNull
        Integer horas,
        @NotNull
        YearMonth dataReferencia,
        @NotNull
        Long funcionarioId,
        @NotNull
        @Size(max = 35)
        List<Long> marcacoesId
) {
}
