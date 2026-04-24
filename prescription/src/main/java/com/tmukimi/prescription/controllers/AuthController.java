package com.tmukimi.prescription.controllers;

import com.tmukimi.prescription.dtos.AuthRequestDTO;
import com.tmukimi.prescription.dtos.AuthResponseDTO;
import com.tmukimi.prescription.dtos.SignupRequestDTO;
import com.tmukimi.prescription.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> registerPatient(@Valid @RequestBody SignupRequestDTO dto) {
        return ResponseEntity.ok(authService.registerPatient(dto));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok("Logged out successfully.");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponseDTO> refreshAccessToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(authService.refreshAccessToken(refreshToken));
    }

}