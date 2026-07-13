package com.formplantao.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record MarcacaoDTO(
        Long id,
        @NotNull
        LocalDate dataMarcada,
        @NotNull
        char marca,
        @NotNull
        Long formId
) {
}
