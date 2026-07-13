package com.formplantao.repository;

import com.formplantao.model.FormularioUnico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;

public interface FormularioUnicoRepository extends JpaRepository<FormularioUnico, Long> {
    List<FormularioUnico> findByDataReferencia(YearMonth dataReferencia);

}
