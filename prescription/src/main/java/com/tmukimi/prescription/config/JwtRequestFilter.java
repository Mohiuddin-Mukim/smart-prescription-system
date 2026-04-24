package com.tmukimi.prescription.config;

import com.tmukimi.prescription.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * ইউজার যখনই কোনো API কল করে, তখন এই ক্লাসটি সবার আগে সক্রিয় হয়।
 * এটি টোকেন ভ্যালিডেট করে এবং ডাটাবেস কল ছাড়াই ইউজারকে অথেন্টিকেট করে।
 * Author: Mohiuddin Rahman Mukim
 */

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.contains("/api/v1/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    Claims claims = jwtUtil.extractAllClaims(token);
                    String email = claims.getSubject();

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null
                    );

                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}