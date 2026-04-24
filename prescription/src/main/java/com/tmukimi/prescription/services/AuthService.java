package com.tmukimi.prescription.services;

import com.tmukimi.prescription.dtos.AuthRequestDTO;
import com.tmukimi.prescription.dtos.AuthResponseDTO;
import com.tmukimi.prescription.dtos.SignupRequestDTO;
import com.tmukimi.prescription.entities.User;
import com.tmukimi.prescription.repositories.RefreshTokenRepository;
import com.tmukimi.prescription.repositories.UserRepository;
import com.tmukimi.prescription.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public String registerPatient(SignupRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .build();

        userRepository.save(user);

        return "Patient registered successfully!";
    }


    public AuthResponseDTO login(AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getFullName());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponseDTO(accessToken, refreshToken, user.getId(), user.getEmail(), user.getFullName());
    }



    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
    }

    public AuthResponseDTO refreshAccessToken(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .filter(token -> !token.isRevoked() && token.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(token -> {
                    User user = token.getUser();
                    String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getFullName());
                    return new AuthResponseDTO(newAccessToken, refreshToken, user.getId(), user.getEmail(), user.getFullName());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is invalid or expired!"));
    }

}