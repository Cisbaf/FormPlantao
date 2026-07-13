package com.formplantao.model;

import jakarta.persistence.*;
import lombok.*;

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
}
