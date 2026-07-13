package com.formplantao.controller;

import com.formplantao.model.Funcionario;
import com.formplantao.model.dto.FuncionarioDTO;
import com.formplantao.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<FuncionarioDTO> salvarFuncionario(@RequestBody @Valid FuncionarioDTO funcionarioDTO) {
        FuncionarioDTO saved = funcionarioService.salvarFuncionario(funcionarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FuncionarioDTO> atualizarFuncionario(@RequestBody @Valid FuncionarioDTO funcionarioDTO, @PathVariable Long id) {
        FuncionarioDTO updated = funcionarioService.atualizarFuncionario(funcionarioDTO, id);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> getAll() {
        List<Funcionario> funcionarios = funcionarioService.getAll();
        return ResponseEntity.ok(funcionarios);
    }
}
