package com.tmukimi.prescription.dtos;

import lombok.Data;

@Data
public class MedicineRequestDTO {
    private Long medicineId;
    private String dosage;
}