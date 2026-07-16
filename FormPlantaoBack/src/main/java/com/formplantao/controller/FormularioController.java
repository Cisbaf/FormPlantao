package com.formplantao.controller;

import com.formplantao.model.FormularioUnico;
import com.formplantao.model.dto.FormularioDTO;
import com.formplantao.service.FormularioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
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

    @PutMapping("/{id}")
    public ResponseEntity<FormularioDTO> updateFormulario(@PathVariable Long id, @RequestBody FormularioDTO formularioDTO) {
        if (id == null || formularioDTO == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok(formularioService.editFormulario(formularioDTO, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        formularioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/data")
    public ResponseEntity<Void> deleteByDataReferencia(@RequestParam YearMonth dataReferencia) {
        if (dataReferencia == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        formularioService.deleteAllByDataReferencia(dataReferencia);
        return ResponseEntity.noContent().build();
    }
}
