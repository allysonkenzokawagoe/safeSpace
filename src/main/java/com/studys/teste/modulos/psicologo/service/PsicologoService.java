package com.studys.teste.modulos.psicologo.service;

import com.studys.teste.modulos.autenticacao.enums.EPermissao;
import com.studys.teste.modulos.comum.enums.ESituacao;
import com.studys.teste.modulos.comum.exception.ValidacaoException;
import com.studys.teste.modulos.psicologo.dto.PsicologoRequest;
import com.studys.teste.modulos.psicologo.dto.PsicologoResponse;
import com.studys.teste.modulos.psicologo.mapper.PsicologoMapper;
import com.studys.teste.modulos.psicologo.model.Psicologo;
import com.studys.teste.modulos.psicologo.repository.PsicologoRepository;
import com.studys.teste.modulos.usuario.mapper.UsuarioMapper;
import com.studys.teste.modulos.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PsicologoService {

    private final PsicologoRepository repository;
    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;
    private final PsicologoMapper mapper;

    @Transactional
    public void cadastrar(PsicologoRequest request) {
        validarPsicologo(request.crp());
        var usuario = usuarioService.cadastrar(usuarioMapper.toRequest(request, EPermissao.PSICOLOGO));
        var psicologo = Psicologo.of(request, usuario);
        repository.save(psicologo);
    }

    public List<PsicologoResponse> listarTodos() {
        return repository.findAllByUsuarioSituacao(ESituacao.ATIVO)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void inativar(Integer id) {
        var psico = getById(id);
        validarSituacao(psico, ESituacao.INATIVO);
        psico.setSituacao(ESituacao.INATIVO);
        repository.save(psico);
    }

    @Transactional
    public void ativar(Integer id) {
        var psico = getById(id);
        validarSituacao(psico, ESituacao.ATIVO);
        psico.setSituacao(ESituacao.ATIVO);
        repository.save(psico);
    }

    public Psicologo getById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new ValidacaoException("Psicólogo não encontrado"));
    }

    private void validarPsicologo(String crp) {

    }

    private void validarSituacao(Psicologo psico, ESituacao situacao) {
        if(situacao == psico.getSituacao()) {
            throw new ValidacaoException("Situação ja está " + situacao.name());
        }
    }
}
