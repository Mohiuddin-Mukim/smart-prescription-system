package com.tmukimi.prescription.controllers;

import com.tmukimi.prescription.dtos.ExtractedMedicineDTO;
import com.tmukimi.prescription.dtos.PrescriptionDetailsDTO;
import com.tmukimi.prescription.dtos.PrescriptionRequestDTO;
import com.tmukimi.prescription.entities.Prescription;
import com.tmukimi.prescription.entities.User;
import com.tmukimi.prescription.services.CustomUserDetails;
import com.tmukimi.prescription.services.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping("/manual")
    public ResponseEntity<?> createManual(@RequestBody PrescriptionRequestDTO request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Prescription saved = prescriptionService.saveManualPrescription(request, userDetails.getUser());
        return ResponseEntity.ok(Map.of("message", "Saved","pdfUrl", saved.getPdfFilePath()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionDetails(id, userDetails.getUser()));
    }


    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(prescriptionService.getAllForUser());
    }



    @PostMapping("/upload-extract")
    public ResponseEntity<?> uploadAndExtract(@RequestParam("file") MultipartFile file) {
        try {
            List<ExtractedMedicineDTO> result = prescriptionService.extractMedicinesFromPdf(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}