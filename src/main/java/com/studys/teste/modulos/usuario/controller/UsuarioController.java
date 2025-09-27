package com.studys.teste.modulos.usuario.controller;

import com.studys.teste.modulos.usuario.dto.UsuarioRequest;
import com.studys.teste.modulos.usuario.dto.UsuarioResponse;
import com.studys.teste.modulos.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public void cadastrar(@RequestBody @Valid UsuarioRequest usuarioRequest) {
        usuarioService.cadastrar(usuarioRequest);
    }

    @GetMapping
    public List<UsuarioResponse> buscarTodos() {
        return usuarioService.buscarTodos();
    }

    @GetMapping("{id}")
    public UsuarioResponse buscarUsuario(@PathVariable Integer id) {
        return usuarioService.buscarUsuario(id);
    }

    @DeleteMapping("{id}")
    public void deletar(@PathVariable Integer id) {
        usuarioService.excluir(id);
    }

}
