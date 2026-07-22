package com.formplantao.repository;

import com.formplantao.model.Marcacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface MarcacaoRepository extends JpaRepository<Marcacao, Long> {
    Set<Marcacao> findAllByIdIn(List<Long> ids);
    List<Marcacao> findAllByDataMarcadaAndMarca(LocalDate dataMarcada, String marca);
    List<Marcacao> findAllByDataMarcada(LocalDate dataMarcada);

}
