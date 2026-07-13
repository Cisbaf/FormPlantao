package com.formplantao.controller;

import com.formplantao.model.FormularioUnico;
import com.formplantao.model.dto.FormularioDTO;
import com.formplantao.service.FormularioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/formularios")
public class FormularioController {

    private final FormularioService formularioService;

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody @Valid FormularioDTO formularioDTO) {
        Object saved = formularioService.saveFormulario(formularioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<FormularioUnico>> getAll() {
        List<FormularioUnico> formularios = formularioService.getAll();
        return ResponseEntity.ok(formularios);
    }

    @GetMapping("/dto")
    public ResponseEntity<List<FormularioDTO>> getAllDTO() {
        List<FormularioDTO> dto = formularioService.getAllDTO();
        return ResponseEntity.ok(dto);
    }
}
