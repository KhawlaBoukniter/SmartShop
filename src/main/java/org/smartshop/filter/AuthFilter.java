package org.smartshop.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class AuthFilter extends OncePerRequestFilter {

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/login"
    );

    private static final Pattern CLIENT_ALLOWED = Pattern.compile(
            "^/api/products.*$|" +
                    "^/api/clients/me$|" +
                    "^/api/orders/my-orders$|" +
                    "^/api/clients/\\d+$|" +
                    "^/api/orders/client/\\d+$"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(401, "Authentification requise");
            return;
        }

        String role = (String) session.getAttribute("role");
        Long userId = (Long) session.getAttribute("userId");

        if ("CLIENT".equals(role)) {
            if (!"GET".equals(method) && !path.startsWith("/api/auth/logout")) {
                response.sendError(403, "CLIENT : seules les requêtes GET sont autorisées");
                return;
            }

            if (!path.startsWith("/api/products") &&
                    !path.startsWith("/api/clients/me") &&
                    !path.startsWith("/api/orders/my-orders") &&
                    !path.startsWith("/api/auth/logout")) {
                response.sendError(403, "Accès interdit pour le rôle CLIENT");
                return;
            }

            filterChain.doFilter(request, response);
            return;
        }

        if ("ADMIN".equals(role)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.sendError(403, "Rôle inconnu");
    }

}