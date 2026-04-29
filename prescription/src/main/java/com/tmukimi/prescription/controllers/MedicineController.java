package com.tmukimi.prescription.controllers;

import com.tmukimi.prescription.dtos.MedicineDetailDTO;
import com.tmukimi.prescription.dtos.MedicineSuggestionDTO;
import com.tmukimi.prescription.services.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDetailDTO> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineDetails(id));
    }



    @GetMapping("/search")
    public ResponseEntity<List<MedicineSuggestionDTO>> search(@RequestParam String q) {
        return ResponseEntity.ok(medicineService.searchMedicines(q));
    }


}
