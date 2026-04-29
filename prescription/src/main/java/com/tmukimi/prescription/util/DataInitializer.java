package com.tmukimi.prescription.util;

import com.tmukimi.prescription.repositories.MedicineRepository;
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
    private final MedicineRepository medicineRepository;

    @Override
    public void run(String... args) {
        try {
            log.info("Checking if data import is needed...");

            long count = medicineRepository.count();

            if (count == 0) {
                log.info("Database is empty. Starting data import...");
                importer.importAllData();
                log.info("Initial data import process finished.");
            } else {
                log.info("Database already contains {} medicines. Skipping import.", count);
            }

        } catch (Exception e) {
            log.error("Error during data initialization: ", e);
        }
    }
}