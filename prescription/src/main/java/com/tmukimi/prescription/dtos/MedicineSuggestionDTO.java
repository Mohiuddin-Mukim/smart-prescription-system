package com.tmukimi.prescription.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class MedicineSuggestionDTO {
    private Long id;
    private String brandName;
    private String genericName;
    private String strength;
    private String manufacturerName;
}