package com.tmukimi.prescription.services;

import com.opencsv.CSVReader;
import com.tmukimi.prescription.entities.Generic;
import com.tmukimi.prescription.entities.Manufacturer;
import com.tmukimi.prescription.entities.Medicine;
import com.tmukimi.prescription.repositories.GenericRepository;
import com.tmukimi.prescription.repositories.ManufacturerRepository;
import com.tmukimi.prescription.repositories.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedicineDataImporterService {

    private final GenericRepository genericRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final MedicineRepository medicineRepository;

    @Transactional
    public void importAllData() throws Exception {
        log.info(">>> Starting Master Data Import...");

        importManufacturers();
        importGenerics();
        importMedicines();

        log.info(">>> All Data Imported Successfully!");
    }

    private void importManufacturers() throws Exception {
        log.info("Importing Manufacturers...");
        try (CSVReader reader = new CSVReader(new InputStreamReader(new ClassPathResource("data/manufacturer.csv").getInputStream()))) {
            String[] line;
            reader.readNext(); // Skip header
            List<Manufacturer> list = new ArrayList<>();
            while ((line = reader.readNext()) != null) {
                list.add(new Manufacturer(Long.parseLong(line[0]), line[1]));
            }
            manufacturerRepository.saveAll(list);
        }
    }

    private void importGenerics() throws Exception {
        log.info("Importing Generics (Cleaning HTML)...");
        try (CSVReader reader = new CSVReader(
                new InputStreamReader(new ClassPathResource("data/generic.csv").getInputStream()))) {

            String[] line;
            reader.readNext(); // skip header

            List<Generic> list = new ArrayList<>();

            while ((line = reader.readNext()) != null) {
                Generic g = new Generic();

                g.setId(Long.parseLong(line[0]));
                g.setGenericName(line[1]);

                g.setIndicationDescription(cleanHtml(line[6]));
                g.setTherapeuticClassDescription(cleanHtml(line[7]));
                g.setPharmacologyDescription(cleanHtml(line[8]));
                g.setDosageDescription(cleanHtml(line[9]));

                g.setAdministrationDescription(cleanHtml(line[10]));
                g.setInteractionDescription(cleanHtml(line[11]));
                g.setContraindicationsDescription(cleanHtml(line[12]));

                g.setSideEffectsDescription(cleanHtml(line[13]));
                g.setPregnancyAndLactationDescription(cleanHtml(line[14]));
                g.setPrecautionsDescription(cleanHtml(line[15]));
                g.setPediatricUsageDescription(cleanHtml(line[16]));
                g.setOverdoseEffectsDescription(cleanHtml(line[17]));
                g.setStorageConditionsDescription(cleanHtml(line[18]));

                list.add(g);

                if (list.size() >= 500) {
                    genericRepository.saveAll(list);
                    list.clear();
                }
            }

            if (!list.isEmpty()) {
                genericRepository.saveAll(list);
            }
        }
    }

    private void importMedicines() throws Exception {
        log.info("Importing Medicines and Linking Relationships...");

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(new ClassPathResource("data/medicine.csv").getInputStream()))) {

            String[] line;
            reader.readNext(); // skip header

            List<Medicine> list = new ArrayList<>();

            while ((line = reader.readNext()) != null) {
                try {
                    if (line.length < 8) continue;

                    Medicine m = new Medicine();

                    m.setId(Long.parseLong(line[0].trim())); // brand_id
                    m.setBrandName(line[1].trim());
                    m.setType(line[2].trim());
                    m.setDosageForm(line[4].trim());
                    m.setStrength(line[6].trim());

                    // ❗ FIX: এখানে ID না, name দিয়ে খুঁজতে হবে
                    String genericName = line[5].trim();
                    String manufacturerName = line[7].trim();

                    Generic generic = genericRepository
                            .findByGenericNameIgnoreCase(genericName)
                            .orElse(null);

                    Manufacturer manufacturer = manufacturerRepository
                            .findByManufacturerNameIgnoreCase(manufacturerName)
                            .orElse(null);

                    m.setGeneric(generic);
                    m.setManufacturer(manufacturer);

                    list.add(m);

                    if (list.size() >= 1000) {
                        medicineRepository.saveAll(list);
                        list.clear();
                    }

                } catch (Exception e) {
                    log.warn("Skipping line due to error: {}", Arrays.toString(line));
                }
            }

            if (!list.isEmpty()) {
                medicineRepository.saveAll(list);
            }
        }
    }

    private String cleanHtml(String html) {
        if (html == null || html.isBlank()) return "N/A";
        return Jsoup.parse(html).text().trim();
    }
}