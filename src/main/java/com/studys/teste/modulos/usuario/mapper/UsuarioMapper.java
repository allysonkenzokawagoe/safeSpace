package com.studys.teste.modulos.usuario.mapper;

import com.studys.teste.modulos.autenticacao.enums.EPermissao;
import com.studys.teste.modulos.psicologo.dto.PsicologoRequest;
import com.studys.teste.modulos.usuario.dto.UsuarioRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioRequest toRequest(PsicologoRequest request, EPermissao role);
}
