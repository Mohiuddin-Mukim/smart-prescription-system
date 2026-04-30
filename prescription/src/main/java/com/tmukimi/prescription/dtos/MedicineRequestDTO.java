package com.tmukimi.prescription.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicineRequestDTO {
    private Long medicineId;
    private String dosage;
    private Integer durationDays;
    private LocalDate startDate;
}