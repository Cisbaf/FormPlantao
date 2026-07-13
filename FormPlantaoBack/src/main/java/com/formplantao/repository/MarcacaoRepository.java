package com.formplantao.repository;

import com.formplantao.model.Marcacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface MarcacaoRepository extends JpaRepository<Marcacao, Long> {
    Set<Marcacao> findAllByIdIn(List<Long> ids);
}
