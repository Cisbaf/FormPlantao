package com.formplantao.model.dto;

public record HorasDto(
         Long id,
         Long horasCompletas,
         Long horasExtras,
         Long horasFaltantes,
         Long horasAusentes
) {
        
}
