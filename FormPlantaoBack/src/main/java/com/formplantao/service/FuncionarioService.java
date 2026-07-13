package com.formplantao.service;

import com.formplantao.model.Funcionario;
import com.formplantao.model.dto.FuncionarioDTO;
import com.formplantao.repository.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionarioService {
    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioDTO salvarFuncionario(FuncionarioDTO funcionarioDTO) {
        var newfuncionario = Funcionario.builder()
                .locacao(funcionarioDTO.locacao())
                .nome(funcionarioDTO.nome())
                .matricula(funcionarioDTO.matricula())
                .build();

        var salvado = funcionarioRepository.save(newfuncionario);

        return FuncionarioDTO.builder()
                .nome(salvado.getNome())
                .matricula(salvado.getMatricula())
                .locacao(salvado.getLocacao())
                .build();

    }

    public FuncionarioDTO atualizarFuncionario(FuncionarioDTO funcionarioDTO, Long id) {
        var funciEx = funcionarioRepository.findById(id).orElseThrow();

        var newFuncionario = Funcionario.builder()
                .nome(funcionarioDTO.nome() != null ? funcionarioDTO.nome() : funciEx.getNome())
                .matricula(funcionarioDTO.matricula() != null ? funcionarioDTO.matricula() : funciEx.getMatricula())
                .locacao(funcionarioDTO.locacao() != null ? funcionarioDTO.locacao() : funciEx.getLocacao())
                .build();
        var atualizado = funcionarioRepository.save(newFuncionario);

        return FuncionarioDTO.builder().id(atualizado.getId()).nome(atualizado.getNome()).matricula(atualizado.getMatricula()).locacao(atualizado.getLocacao()).build();
    }

    public List<Funcionario> getAll() {
        return funcionarioRepository.findAll();
    }
}
