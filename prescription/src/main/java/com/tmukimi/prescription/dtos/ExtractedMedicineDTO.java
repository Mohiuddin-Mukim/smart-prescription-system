package com.tmukimi.prescription.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedMedicineDTO {

    private Long medicineId;
    private String brandName;
    private String dosage;
    private Integer durationDays;

}