package com.tmukimi.prescription.dtos;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PrescriptionRequestDTO {
    private String doctorName;
    private LocalDate prescriptionDate;
    private List<MedicineRequestDTO> medicines;
}