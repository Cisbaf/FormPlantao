package com.formplantao.service;

import com.formplantao.model.FormularioUnico;
import com.formplantao.model.Funcionario;
import com.formplantao.model.Marcacao;
import com.formplantao.model.Horas;
import com.formplantao.model.dto.FormularioDTO;
import com.formplantao.model.dto.HorasDto;
import com.formplantao.repository.FormularioUnicoRepository;
import com.formplantao.repository.FuncionarioRepository;
import com.formplantao.repository.MarcacaoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FormularioService {
    private final FormularioUnicoRepository formularioUnicoRepository;
    private final MarcacaoRepository marcacaoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private static final String NOME_TODOS = "Todos";
    private static final Long MATRICULA_TODOS = 0L;


    public List<FormularioDTO> getAllDTO() {
        return formularioUnicoRepository.findAll().stream()
                .map(f -> {
                    Horas h = f.getHorasTotais();
                    HorasDto horasDto = h != null ? new HorasDto(h.getId(), h.getHorasPlantoes(), h.getHorasExtras(), h.getHorasFerias(), h.getHorasAusentes()) : null;
                    return FormularioDTO.builder()
                            .id(f.getId())
                            .horas(f.getHoras())
                            .dataReferencia(f.getDataReferencia())
                            .funcionarioId(f.getFuncionario().getId())
                            .marcacoesId(f.getMarcacoes().stream().map(Marcacao::getId).toList())
                            .horasDto(horasDto)
                            .build();
                })
                .toList();
    }

    public List<FormularioUnico> getAll() {
        return formularioUnicoRepository.findAll();
    }

    public List<FormularioUnico> getByData(YearMonth dataReferencia) {
        return formularioUnicoRepository.findByDataReferencia(dataReferencia);
    }

    @Transactional
    public void deleteById(Long id) {
        formularioUnicoRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllByDataReferencia(YearMonth dataReferencia) {
        formularioUnicoRepository.deleteAllByDataReferencia(dataReferencia);
    }

    @Transactional
    public FormularioDTO editFormulario(FormularioDTO formularioDTO, Long id) {
        if (formularioDTO == null || id == null) {
            return null;
        }
        var formulario = formularioUnicoRepository.findById(id).orElseThrow();

        formulario.setDataReferencia(formularioDTO.dataReferencia() != null ?  formularioDTO.dataReferencia() : formulario.getDataReferencia());
        formulario.setHoras(formularioDTO.horas() != null ? formularioDTO.horas() : formulario.getHoras());

        var formularioEditado = formularioUnicoRepository.save(formulario);

        return convertToDTO(formularioEditado);
    }

    @Transactional
    public List<FormularioDTO> saveFormulario(FormularioDTO dto) {
        if (dto == null || dto.funcionarioId() == null) {
            throw new IllegalArgumentException("Dados do formulário inválidos.");
        }

        var alvo = funcionarioRepository.findById(dto.funcionarioId())
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));

        Set<Long> jaTemFormulario = formularioUnicoRepository.findByDataReferencia(dto.dataReferencia())
                .stream()
                .map(f -> f.getFuncionario().getId())
                .collect(Collectors.toSet());

        Set<Marcacao> marcacoes = buscarMarcacoes(dto.marcacoesId());

        List<FormularioUnico> novos = destinatarios(alvo).stream()
                .filter(func -> !jaTemFormulario.contains(func.getId()))
                .map(func -> FormularioUnico.builder()
                        .horas(dto.horas())
                        .dataReferencia(dto.dataReferencia())
                        .funcionario(func)
                        .marcacoes(new HashSet<>(marcacoes))
                        .build())
                .toList();

        return formularioUnicoRepository.saveAll(novos).stream()
                .map(this::convertToDTO)
                .toList();
    }

    private List<Funcionario> destinatarios(Funcionario alvo) {
        if (isCoringaTodos(alvo)) {
            return List.of(alvo);
        }

        return funcionarioRepository.findAll().stream()
                .filter(this::isCoringaTodos)
                .toList();
    }

    private boolean isCoringaTodos(Funcionario f) {
        return !NOME_TODOS.equals(f.getNome()) || !MATRICULA_TODOS.equals(f.getMatricula());
    }

    private Set<Marcacao> buscarMarcacoes(List<Long> ids) {
        return (ids == null || ids.isEmpty()) ? Set.of() : marcacaoRepository.findAllByIdIn(ids);
    }

    private FormularioDTO convertToDTO(FormularioUnico entity) {
        List<Long> marcacoesIds = entity.getMarcacoes() != null
                ? entity.getMarcacoes().stream().map(Marcacao::getId).collect(Collectors.toList())
                : new ArrayList<>();

        Horas h = entity.getHorasTotais();
        HorasDto horasDto = h != null ? new HorasDto(h.getId(), h.getHorasPlantoes(), h.getHorasExtras(), h.getHorasFerias(), h.getHorasAusentes()) : null;

        return FormularioDTO.builder()
                .id(entity.getId())
                .horas(entity.getHoras())
                .dataReferencia(entity.getDataReferencia())
                .funcionarioId(entity.getFuncionario().getId())
                .marcacoesId(marcacoesIds)
                .horasDto(horasDto)
                .build();
    }
}