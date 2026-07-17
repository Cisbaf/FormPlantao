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
    @Column(nullable = false)
    private int horas;
    @Column(nullable = false)
    private YearMonth dataReferencia;

    @ManyToOne(fetch = FetchType.LAZY)
    private Funcionario funcionario;

    @OneToMany(mappedBy = "formularioUnico", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Marcacao> marcacoes = new LinkedHashSet<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "horas_id")
    @Builder.Default
    private Horas horasTotais = new Horas();

    public Horas getHorasTotais() {
        if (this.horasTotais == null) {
            this.horasTotais = new Horas();
        }
        if (this.horasTotais.getHorasPlantoes() == null) this.horasTotais.setHorasPlantoes(0L);
        if (this.horasTotais.getHorasExtras() == null) this.horasTotais.setHorasExtras(0L);
        if (this.horasTotais.getHorasFerias() == null) this.horasTotais.setHorasFerias(0L);
        if (this.horasTotais.getHorasAusentes() == null) this.horasTotais.setHorasAusentes(0L);
        return this.horasTotais;
    }

    public void adicionarMarcacao(Marcacao marcacao) {
        marcacoes.add(marcacao);
        marcacao.setFormularioUnico(this);
    }

    public void removerMarcacao(Marcacao marcacao) {
        marcacoes.remove(marcacao);
        marcacao.setFormularioUnico(null);
    }

}
