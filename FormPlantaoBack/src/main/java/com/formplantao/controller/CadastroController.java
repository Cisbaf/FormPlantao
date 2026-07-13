package com.formplantao.controller;

import com.formplantao.service.CadastroService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cadastro")
public class CadastroController {

    private final CadastroService cadastroService;

}
