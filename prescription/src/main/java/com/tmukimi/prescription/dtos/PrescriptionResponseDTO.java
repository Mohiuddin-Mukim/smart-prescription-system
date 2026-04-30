package com.tmukimi.prescription.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PrescriptionResponseDTO {
    private String message;
    private Long prescriptionId;
    private String pdfUrl;
}