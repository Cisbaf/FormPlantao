package com.formplantao.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Builder
public record MarcacaoDTO(
        Long id,
        @NotNull
        LocalDate dataMarcada,
        @NotNull
        @Length(max = 2)
        String marca,
        @NotNull
        Long formId
) {
}
