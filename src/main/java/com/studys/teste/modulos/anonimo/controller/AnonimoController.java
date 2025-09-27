package com.studys.teste.modulos.anonimo.controller;

import com.studys.teste.modulos.anonimo.dto.AnonimoRequest;
import com.studys.teste.modulos.anonimo.service.AnonimoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/anonimo")
public class AnonimoController {

    private final AnonimoService anonimoService;

    @PostMapping
    public void cadastrar(@RequestBody AnonimoRequest request) {
        anonimoService.cadastrar(request);
    }

}
