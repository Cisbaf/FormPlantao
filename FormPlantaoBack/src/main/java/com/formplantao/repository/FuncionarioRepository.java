package com.formplantao.repository;

import com.formplantao.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByNomeAndMatricula(String nome, Long matricula);
}
