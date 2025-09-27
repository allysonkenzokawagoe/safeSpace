package com.studys.teste.modulos.autenticacao.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.experimental.UtilityClass;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@UtilityClass
public class TokenUtils {

    public static String getHeaderToken(HttpServletRequest request) {
        var headerAuth = request.getHeader("Authorization");

        if(headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }

    public String getHeaderToken() {
        var request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        return getHeaderToken(request);
    }

}
