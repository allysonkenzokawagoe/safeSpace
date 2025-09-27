package com.studys.teste.modulos.psicologo.controller;

import com.studys.teste.modulos.psicologo.dto.PsicologoRequest;
import com.studys.teste.modulos.psicologo.dto.PsicologoResponse;
import com.studys.teste.modulos.psicologo.model.Psicologo;
import com.studys.teste.modulos.psicologo.service.PsicologoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/psicologo")
public class PsicologoController {

    private final PsicologoService service;

    @PostMapping
    public void cadastrar(@RequestBody PsicologoRequest request) {
        service.cadastrar(request);
    }

    @GetMapping
    public List<PsicologoResponse> listar() {
        return service.listarTodos();
    }

    @GetMapping("{id}")
    public Psicologo buscar(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("{id}/inativar")
    public void inativar(@PathVariable Integer id) {
        service.inativar(id);
    }

    @PutMapping("{id}/ativar")
    public void ativar(@PathVariable Integer id) {
        service.ativar(id);
    }
}
