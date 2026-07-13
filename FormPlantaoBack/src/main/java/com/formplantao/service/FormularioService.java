package com.formplantao.service;

import com.formplantao.model.FormularioUnico;
import com.formplantao.model.Marcacao;
import com.formplantao.model.dto.FormularioDTO;
import com.formplantao.repository.FormularioUnicoRepository;
import com.formplantao.repository.FuncionarioRepository;
import com.formplantao.repository.MarcacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FormularioService {
    private final FormularioUnicoRepository formularioUnicoRepository;
    private final MarcacaoRepository marcacaoRepository;
    private final FuncionarioRepository funcionarioRepository;

    public FormularioDTO save(FormularioDTO formularioDTO) {
        Set<Marcacao> marcacao = new HashSet<>();
        if (formularioDTO == null) {
            throw new IllegalArgumentException();
        }
        var funcionario = funcionarioRepository.findById(formularioDTO.funcionarioId()).orElseThrow();

        if (formularioDTO.marcacoesId() != null) {
            marcacao = marcacaoRepository.findAllByIdIn(formularioDTO.marcacoesId());
        }

        var formulario = FormularioUnico.builder().horas(formularioDTO.horas()).dataReferencia(formularioDTO.dataReferencia())
                .funcionario(funcionario)
                .marcacoes(marcacao)
                .build();
        var newFormulario = formularioUnicoRepository.save(formulario);

        return FormularioDTO.builder()
                .id(newFormulario.getId())
                .horas(newFormulario.getHoras())
                .dataReferencia(newFormulario.getDataReferencia())
                .funcionarioId(newFormulario.getFuncionario().getId())
                .marcacoesId(newFormulario.getMarcacoes().stream().map(Marcacao::getId).toList())
                .build();

    }

    public List<FormularioDTO> getAllDTO() {
        return formularioUnicoRepository.findAll().stream()
                .map(f -> FormularioDTO.builder()
                        .id(f.getId())
                        .horas(f.getHoras())
                        .dataReferencia(f.getDataReferencia())
                        .funcionarioId(f.getFuncionario().getId())
                        .marcacoesId(f.getMarcacoes().stream().map(Marcacao::getId).toList())
                        .build())
                .toList();
    }

    public List<FormularioUnico> getAll() {
        return formularioUnicoRepository.findAll();
    }
}
