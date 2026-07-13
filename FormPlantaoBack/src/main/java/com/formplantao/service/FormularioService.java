package com.formplantao.service;

import com.formplantao.model.FormularioUnico;
import com.formplantao.model.Funcionario;
import com.formplantao.model.Marcacao;
import com.formplantao.model.dto.FormularioDTO;
import com.formplantao.repository.FormularioUnicoRepository;
import com.formplantao.repository.FuncionarioRepository;
import com.formplantao.repository.MarcacaoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormularioService {
    private final FormularioUnicoRepository formularioUnicoRepository;
    private final MarcacaoRepository marcacaoRepository;
    private final FuncionarioRepository funcionarioRepository;



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

    @Transactional
    public List<FormularioDTO> saveFormulario(FormularioDTO formularioDTO) {
        if (formularioDTO == null || formularioDTO.funcionarioId() == null) {
            throw new IllegalArgumentException("Dados do formulário inválidos.");
        }

        // 1. Identificar o funcionário que veio no pedido
        var funcionarioAlvo = funcionarioRepository.findById(formularioDTO.funcionarioId())
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));

        // 2. Definir a lista de funcionários que receberão o formulário
        List<Funcionario> funcionarios;
        if ("Tudo".equals(funcionarioAlvo.getNome()) && Long.valueOf(0L).equals(funcionarioAlvo.getMatricula())) {
            funcionarios = funcionarioRepository.findAll();
            // Remove o próprio registro "Tudo" da lista, se ele vier na busca do banco
            funcionarios.removeIf(f -> "Tudo".equals(f.getNome()) && Long.valueOf(0L).equals(f.getMatricula()));
        } else {
            // Se for um funcionário normal, criamos uma lista contendo apenas ele
            funcionarios = List.of(funcionarioAlvo);
        }

        if (funcionarios.isEmpty()) {
            return Collections.emptyList();
        }

        // 3. Buscar os formulários que já existem nessa data
        var formulariosExistentes = formularioUnicoRepository.findByDataReferencia(formularioDTO.dataReferencia());
        Set<Long> funcComFormularioIds = formulariosExistentes.stream()
                .map(f -> f.getFuncionario().getId())
                .collect(Collectors.toSet());

        // 4. Filtrar: Manter apenas os funcionários que ainda NÃO têm formulário
        List<Funcionario> funcionariosParaProcessar = funcionarios.stream()
                .filter(func -> !funcComFormularioIds.contains(func.getId()))
                .toList();

        // Se todos já tiverem formulário (ou o único funcionário pedido já tiver), encerra aqui
        if (funcionariosParaProcessar.isEmpty()) {
            return Collections.emptyList();
        }

        // 5. Buscar as marcações uma única vez
        Set<Marcacao> marcacoes = new HashSet<>();
        if (formularioDTO.marcacoesId() != null && !formularioDTO.marcacoesId().isEmpty()) {
            marcacoes = marcacaoRepository.findAllByIdIn(formularioDTO.marcacoesId());
        }
        final Set<Marcacao> finalMarcacoes = marcacoes;

        // 6. Construir os novos formulários para quem passou no filtro
        List<FormularioUnico> formulariosParaSalvar = funcionariosParaProcessar.stream()
                .map(func -> FormularioUnico.builder()
                        .horas(formularioDTO.horas())
                        .dataReferencia(formularioDTO.dataReferencia())
                        .funcionario(func)
                        .marcacoes(finalMarcacoes)
                        .build())
                .collect(Collectors.toList());

        // 7. Salvar tudo (funciona perfeitamente tanto para 1 item quanto para 1000)
        List<FormularioUnico> formulariosSalvos = formularioUnicoRepository.saveAll(formulariosParaSalvar);

        // 8. Converter para DTO e devolver
        return formulariosSalvos.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to keep your code DRY (Don't Repeat Yourself)
    private FormularioDTO convertToDTO(FormularioUnico entity) {
        List<Long> marcacoesIds = entity.getMarcacoes() != null
                ? entity.getMarcacoes().stream().map(Marcacao::getId).collect(Collectors.toList())
                : new ArrayList<>();

        return FormularioDTO.builder()
                .id(entity.getId())
                .horas(entity.getHoras())
                .dataReferencia(entity.getDataReferencia())
                .funcionarioId(entity.getFuncionario().getId())
                .marcacoesId(marcacoesIds)
                .build();
    }

    public List<FormularioUnico> getAll() {
        return formularioUnicoRepository.findAll();
    }
}
