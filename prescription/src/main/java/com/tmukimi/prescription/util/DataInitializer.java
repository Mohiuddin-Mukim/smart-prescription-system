package com.tmukimi.prescription.util;

import com.tmukimi.prescription.services.MedicineDataImporterService;
import com.tmukimi.prescription.services.MedicineDataImporterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MedicineDataImporterService importer;

    @Override
    public void run(String... args) {
        try {
            log.info("Checking if data import is needed...");
            // ডাটাবেস যদি খালি থাকে তবেই ইম্পোর্ট শুরু হবে (ঐচ্ছিক চেক)
            importer.importAllData();
            log.info("Initial data import process finished.");
        } catch (Exception e) {
            log.error("Error during data initialization: ", e);
        }
    }
}