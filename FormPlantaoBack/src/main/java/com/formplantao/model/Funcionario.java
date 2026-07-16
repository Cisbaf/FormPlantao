package com.formplantao.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 50,  nullable = false, unique = true)
    private String nome;
    @Column(length = 10,  nullable = false, unique = true)
    private Long matricula;
    @Column(length = 20,  nullable = false)
    private String locacao;
    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL,  fetch = FetchType.EAGER)
    private List<FormularioUnico> formularios;
}
