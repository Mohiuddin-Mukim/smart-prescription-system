package com.tmukimi.prescription.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PrescriptionDetailsDTO {

    private Long id;
    private String doctorName;
    private String date;
    private String pdfUrl;
    private List<MedicineDetailDTO> medicines;
}