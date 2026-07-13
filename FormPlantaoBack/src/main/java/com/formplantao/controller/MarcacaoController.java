package com.formplantao.controller;

import com.formplantao.model.dto.MarcacaoDTO;
import com.formplantao.service.MarcacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/marcacoes")
public class MarcacaoController {

    private final MarcacaoService marcacaoService;

    @PostMapping
    public ResponseEntity<MarcacaoDTO> salvarMarcacao(@RequestBody @Valid MarcacaoDTO marcacaoDTO) {
        MarcacaoDTO saved = marcacaoService.salvarMarcacao(marcacaoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarcacaoDTO> atualizarMarcacao(@PathVariable Long id, @RequestBody @Valid MarcacaoDTO marcacaoDTO) {
        MarcacaoDTO updated = marcacaoService.atualizarMarcacao(id, marcacaoDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<MarcacaoDTO>> listarMarcacao() {
        List<MarcacaoDTO> marcacoes = marcacaoService.listarMarcacao();
        return ResponseEntity.ok(marcacoes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MarcacaoDTO> deletarMarcacao(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        marcacaoService.deletarByIdMarcacao(id);
        return ResponseEntity.noContent().build();
    }
}
