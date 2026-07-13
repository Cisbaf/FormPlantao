package com.formplantao.service;

import com.formplantao.model.Marcacao;
import com.formplantao.model.dto.MarcacaoDTO;
import com.formplantao.repository.FormularioUnicoRepository;
import com.formplantao.repository.MarcacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarcacaoService {

    private final MarcacaoRepository marcacaoRepository;
    private final FormularioUnicoRepository formularioUnicoRepository;

    public MarcacaoDTO salvarMarcacao(MarcacaoDTO marcacaoDTO) {
        var form = formularioUnicoRepository.findById(marcacaoDTO.formId()).orElseThrow(
                () -> new IllegalArgumentException("Formulário não encontrado.")
        );

        // 1. Aplicação da Regra de Negócio: Validar ciclo do dia 16 ao 15
        LocalDate inicioCiclo = form.getDataReferencia().minusMonths(1).atDay(16);
        LocalDate fimCiclo = form.getDataReferencia().atDay(15);

        if (marcacaoDTO.dataMarcada().isBefore(inicioCiclo) || marcacaoDTO.dataMarcada().isAfter(fimCiclo)) {
            throw new IllegalArgumentException("A data está fora do período do formulário (16 a 15).");
        }

        var marcacao = Marcacao.builder()
                .dataMarcada(marcacaoDTO.dataMarcada())
                .marca(marcacaoDTO.marca())
                .formularioUnico(form)
                .build();

        var newMarcacao = marcacaoRepository.save(marcacao);

        // 2. Correção do mapeamento de retorno
        return MarcacaoDTO.builder()
                .id(newMarcacao.getId())
                .dataMarcada(newMarcacao.getDataMarcada())
                .marca(newMarcacao.getMarca())
                .formId(form.getId())
                .build();
    }

    // 3. Correção: Buscando a marcação existente e retornando o DTO
    public MarcacaoDTO atualizarMarcacao(Long id, MarcacaoDTO marcacaoDTO) {
        var marcacaoExistente = marcacaoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Marcação não encontrada.")
        );

        // Atualiza apenas os dados permitidos
        marcacaoExistente.setDataMarcada(marcacaoDTO.dataMarcada());
        marcacaoExistente.setMarca(marcacaoDTO.marca());

        var marcacaoAtualizada = marcacaoRepository.save(marcacaoExistente);

        return MarcacaoDTO.builder()
                .id(marcacaoAtualizada.getId())
                .dataMarcada(marcacaoAtualizada.getDataMarcada())
                .marca(marcacaoAtualizada.getMarca())
                .formId(marcacaoAtualizada.getFormularioUnico().getId())
                .build();
    }

    public List<MarcacaoDTO> listarMarcacao() {
        var marcacoes = marcacaoRepository.findAll();
        return marcacoes.stream()
                .map(m -> MarcacaoDTO.builder()
                        .id(m.getId())
                        .dataMarcada(m.getDataMarcada())
                        .marca(m.getMarca())
                        .formId(m.getFormularioUnico().getId())
                        .build())
                .toList();
    }
}
