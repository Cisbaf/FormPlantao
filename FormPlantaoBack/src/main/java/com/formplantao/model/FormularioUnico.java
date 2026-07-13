package com.formplantao.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.YearMonth;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FormularioUnico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int horas;
    private YearMonth dataReferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    private Funcionario funcionario;

    @OneToMany(mappedBy = "formularioUnico", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Marcacao> marcacoes = new LinkedHashSet<>();

    public void adicionarMarcacao(Marcacao marcacao) {
        marcacoes.add(marcacao);
        marcacao.setFormularioUnico(this);
    }

    public void removerMarcacao(Marcacao marcacao) {
        marcacoes.remove(marcacao);
        marcacao.setFormularioUnico(null);
    }

}
