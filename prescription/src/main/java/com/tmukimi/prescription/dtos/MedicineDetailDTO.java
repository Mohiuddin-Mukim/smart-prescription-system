package com.tmukimi.prescription.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MedicineDetailDTO {
    private Long brandId;
    private String brandName;
    private String type;
    private String dosageForm;
    private String strength;

    // Manufacturer Info
    private String manufacturerName;

    // Generic Details
    private String genericName;
    private String indication;
    private String pharmacology;
    private String dosageDescription;
    private String sideEffects;
    private String contraindications;
    private String pregnancyAndLactation;
    private String storageConditions;





    private String dosage;
    private String startDate;
    private Integer durationDays;
    private Long daysPassed;
    private Long daysRemaining;
    private String status;
}