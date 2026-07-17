package com.formplantao.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Horas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long horasPlantoes = 0L;
    private Long horasExtras = 0L;
    private Long horasFerias = 0L;
    private Long horasAusentes = 0L;

    @OneToOne(mappedBy = "horasTotais")
    @JsonIgnore
    private FormularioUnico  formulario;
}
