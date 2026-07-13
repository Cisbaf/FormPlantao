package com.formplantao.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record FuncionarioDTO(
        Long id,
        @NotBlank
        @Size(min = 3, max = 50)
        String nome,
        @NotNull
        Long matricula,
        @NotBlank
        String locacao
) {
}
