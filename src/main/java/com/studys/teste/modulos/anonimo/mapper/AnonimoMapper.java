package com.studys.teste.modulos.anonimo.mapper;

import com.studys.teste.modulos.anonimo.dto.AnonimoRequest;
import com.studys.teste.modulos.usuario.dto.UsuarioRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AnonimoMapper {

    UsuarioRequest toUsuarioRequest(AnonimoRequest anonimoRequest);

}
