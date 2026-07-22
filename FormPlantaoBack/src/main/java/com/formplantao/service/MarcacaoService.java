package com.formplantao.service;

import com.formplantao.model.Horas;
import com.formplantao.model.Marcacao;
import com.formplantao.model.dto.ContagemDiariaResponseDTO;
import com.formplantao.model.dto.MarcacaoDTO;
import com.formplantao.model.dto.RelatorioLocacaoDTO;
import com.formplantao.repository.FormularioUnicoRepository;
import com.formplantao.repository.MarcacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarcacaoService {

    private final MarcacaoRepository marcacaoRepository;
    private final FormularioUnicoRepository formularioUnicoRepository;

    @Transactional
    public MarcacaoDTO salvarMarcacao(MarcacaoDTO marcacaoDTO) {
        var form = formularioUnicoRepository.findById(marcacaoDTO.formId()).orElseThrow(
                () -> new IllegalArgumentException("Formulário não encontrado.")
        );

        LocalDate inicioCiclo = form.getDataReferencia().minusMonths(1).atDay(16);
        LocalDate fimCiclo = form.getDataReferencia().atDay(15);

        if (marcacaoDTO.dataMarcada().isBefore(inicioCiclo) || marcacaoDTO.dataMarcada().isAfter(fimCiclo)) {
            throw new IllegalArgumentException("A data está fora do período do formulário (16 a 15).");
        }

        var horas = form.getHorasTotais();
        if (horas == null) {
            horas = new Horas();
            form.setHorasTotais(horas);
        }

        switchMarcaAdd(marcacaoDTO.marca(), horas);

        var marcacao = Marcacao.builder()
                .dataMarcada(marcacaoDTO.dataMarcada())
                .marca(marcacaoDTO.marca())
                .formularioUnico(form)
                .build();

        var newMarcacao = marcacaoRepository.save(marcacao);

        return MarcacaoDTO.builder()
                .id(newMarcacao.getId())
                .dataMarcada(newMarcacao.getDataMarcada())
                .marca(newMarcacao.getMarca())
                .formId(form.getId())
                .build();
    }

    @Transactional
    public MarcacaoDTO atualizarMarcacao(Long id, MarcacaoDTO marcacaoDTO) {
        var marcacaoExistente = marcacaoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Marcação não encontrada.")
        );

        var marcaAntiga = marcacaoExistente.getMarca();
        var horas = marcacaoExistente.getFormularioUnico().getHorasTotais();

        // Se a marca mudou (ex: de 'F' para 'X'), remove a antiga e adiciona a nova
        if (!Objects.equals(marcaAntiga, marcacaoDTO.marca())) {
            switchMarcaSubtract(marcaAntiga, horas);
            switchMarcaAdd(marcacaoDTO.marca(), horas);
        }

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

    @Transactional
    public void deletarByIdMarcacao(Long id) {
        var marcacao = marcacaoRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Marcação não encontrada.")
        );

        var horas = marcacao.getFormularioUnico().getHorasTotais();

        switchMarcaSubtract(marcacao.getMarca(), horas);

        marcacaoRepository.deleteById(id);
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

    /**
     * Retorna a contagem de cada tipo de marcação para todos os dias do ciclo (16 do mês anterior até 15 do mês atual),
     * já acompanhada dos totais agregados do período e do alerta de ausências.
     */
    public ContagemDiariaResponseDTO getContagemPorDia(YearMonth dataReferencia) {
        LocalDate inicioCiclo = dataReferencia.minusMonths(1).atDay(16);
        LocalDate fimCiclo = dataReferencia.atDay(15);

        Map<LocalDate, Map<Character, Integer>> resultado = new LinkedHashMap<>();

        LocalDate atual = inicioCiclo;
        while (!atual.isAfter(fimCiclo)) {
            resultado.put(atual, getMarcacaoByData(atual));
            atual = atual.plusDays(1);
        }

        return ContagemDiariaResponseDTO.of(resultado);
    }

    public  Map<Character, Integer>  getMarcacaoByData(LocalDate dataMarca) {
        var marcas =  marcacaoRepository.findAllByDataMarcada(dataMarca);
        Map<Character, Integer> contagem = new HashMap<>();
        contagem.put('X', 0); // Plantão
        contagem.put('E', 0); // Extra
        contagem.put('F', 0); // Férias/Folga
        contagem.put('A', 0); // Ausente

        for (Marcacao marcacao : marcas) {
            if (marcacao.getMarca() == null) continue;

            for (char c : marcacao.getMarca().toUpperCase().toCharArray()) {
                if (contagem.containsKey(c)) {
                    contagem.put(c, contagem.get(c) + 1);
                }
            }
        }
        return contagem;
    }

    public List<RelatorioLocacaoDTO> gerarRelatorioAgrupadoPorLocacao(YearMonth dataReferencia) {
        var formularios = formularioUnicoRepository.findByDataReferencia(dataReferencia);

        // Agrupa os formulários pelo nome da locação do funcionário
        var mapPorLocacao = formularios.stream()
                .collect(Collectors.groupingBy(f -> f.getFuncionario().getLocacao()));

        // Transforma o agrupamento no DTO de resposta somando as horas
        return mapPorLocacao.entrySet().stream().map(entry -> {
            String locacao = entry.getKey();
            var forms = entry.getValue();

            long completas = forms.stream().mapToLong(f -> f.getHorasTotais().getHorasPlantoes()).sum();
            long extras = forms.stream().mapToLong(f -> f.getHorasTotais().getHorasExtras()).sum();
            long ferias = forms.stream().mapToLong(f -> f.getHorasTotais().getHorasFerias()).sum();
            long ausentes = forms.stream().mapToLong(f -> f.getHorasTotais().getHorasAusentes()).sum();

            return new RelatorioLocacaoDTO(locacao, completas, extras, ferias, ausentes);
        }).toList();
    }


    private static void switchMarcaAdd(String marca, Horas horas) {
        if (marca == null || marca.isBlank()) return;

        for (char c : marca.toLowerCase().toCharArray()) {
            switch (c) {
                case 'x':
                    horas.setHorasPlantoes(horas.getHorasPlantoes() != null ? horas.getHorasPlantoes() + 1L : 1L);
                    break;
                case 'f':
                    horas.setHorasFerias(horas.getHorasFerias() != null ? horas.getHorasFerias() + 1L : 1L);
                    break;
                case 'e':
                    horas.setHorasExtras(horas.getHorasExtras() != null ? horas.getHorasExtras() + 1L : 1L);
                    break;
                case 'a':
                    horas.setHorasAusentes(horas.getHorasAusentes() != null ? horas.getHorasAusentes() + 1L : 1L);
                    break;
            }
        }
    }

    private static void switchMarcaSubtract(String marca, Horas horas) {
        if (marca == null || marca.isBlank()) return;

        for (char c : marca.toLowerCase().toCharArray()) {
            switch (c) {
                case 'x':
                    horas.setHorasPlantoes((horas.getHorasPlantoes() != null && horas.getHorasPlantoes() > 0) ? horas.getHorasPlantoes() - 1L : 0L);
                    break;
                case 'f':
                    horas.setHorasFerias((horas.getHorasFerias() != null && horas.getHorasFerias() > 0) ? horas.getHorasFerias() - 1L : 0L);
                    break;
                case 'e':
                    horas.setHorasExtras((horas.getHorasExtras() != null && horas.getHorasExtras() > 0) ? horas.getHorasExtras() - 1L : 0L);
                    break;
                case 'a':
                    horas.setHorasAusentes((horas.getHorasAusentes() != null && horas.getHorasAusentes() > 0) ? horas.getHorasAusentes() - 1L : 0L);
                    break;
            }
        }
    }
}