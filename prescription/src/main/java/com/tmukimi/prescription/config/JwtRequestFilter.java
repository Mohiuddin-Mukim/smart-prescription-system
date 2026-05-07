package com.tmukimi.prescription.config;

import com.tmukimi.prescription.entities.User;
import com.tmukimi.prescription.repositories.UserRepository;
import com.tmukimi.prescription.services.CustomUserDetails;
import com.tmukimi.prescription.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

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

        System.out.println("Incoming Request: " + request.getRequestURI());

        String header = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + header);

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);
            System.out.println("Token Found");

            try {
                if (jwtUtil.isTokenValid(token)) {

                    Claims claims = jwtUtil.extractAllClaims(token);
                    String email = claims.getSubject();

                    System.out.println("Email from token: " + email);

                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                        System.out.println("User found in DB");

                        CustomUserDetails userDetails = new CustomUserDetails(user);

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(auth);

                        System.out.println("User Authenticated Successfully");
                    } else {
                        System.out.println("User not found or already authenticated");
                    }
                } else {
                    System.out.println("Invalid Token");
                }

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                System.out.println("JWT Error: " + e.getMessage());
            }
        } else {
            System.out.println("No Token Provided");
        }

        filterChain.doFilter(request, response);
    }
}