package com.tmukimi.prescription.services;

import com.tmukimi.prescription.dtos.MedicineDetailDTO;
import com.tmukimi.prescription.dtos.MedicineSuggestionDTO;
import com.tmukimi.prescription.entities.Generic;
import com.tmukimi.prescription.entities.Medicine;
import com.tmukimi.prescription.repositories.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;


    public MedicineDetailDTO getMedicineDetails(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: " + id));

        MedicineDetailDTO dto = new MedicineDetailDTO();
        dto.setBrandId(medicine.getId());
        dto.setBrandName(medicine.getBrandName());
        dto.setType(medicine.getType());
        dto.setDosageForm(medicine.getDosageForm());
        dto.setStrength(medicine.getStrength());

        if (medicine.getManufacturer() != null) {
            dto.setManufacturerName(medicine.getManufacturer().getManufacturerName());
        }

        if (medicine.getGeneric() != null) {
            Generic g = medicine.getGeneric();
            dto.setGenericName(g.getGenericName());
            dto.setIndication(g.getIndicationDescription());
            dto.setPharmacology(g.getPharmacologyDescription());
            dto.setDosageDescription(g.getDosageDescription());
            dto.setSideEffects(g.getSideEffectsDescription());
            dto.setContraindications(g.getContraindicationsDescription());
            dto.setPregnancyAndLactation(g.getPregnancyAndLactationDescription());
            dto.setStorageConditions(g.getStorageConditionsDescription());
        }

        return dto;
    }


    public List<MedicineSuggestionDTO> searchMedicines(String query) {
        return medicineRepository.findSuggestions(query, PageRequest.of(0, 10))
                .stream()
                .map(m -> new MedicineSuggestionDTO(
                        m.getId(),
                        m.getBrandName(),
                        m.getGeneric() != null ? m.getGeneric().getGenericName() : "N/A",
                        m.getStrength(),
                        m.getManufacturer() != null ? m.getManufacturer().getManufacturerName() : "N/A"
                ))
                .collect(Collectors.toList());
    }
}
