package com.tmukimi.prescription.services;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.tmukimi.prescription.dtos.MedicineDetailDTO;
import com.tmukimi.prescription.dtos.PrescriptionDetailsDTO;
import com.tmukimi.prescription.dtos.PrescriptionRequestDTO;
import com.tmukimi.prescription.entities.*;
import com.tmukimi.prescription.repositories.MedicineRepository;
import com.tmukimi.prescription.repositories.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;

    @Transactional
    public Prescription saveManualPrescription(PrescriptionRequestDTO request, User user) {
        Prescription prescription = new Prescription();
        prescription.setUser(user);
        prescription.setDoctorName(request.getDoctorName());
        prescription.setPrescriptionDate(request.getPrescriptionDate());
        prescription.setIsManualEntry(true);

        List<PrescriptionItem> items = request.getMedicines().stream().map(mReq -> {
            PrescriptionItem item = new PrescriptionItem();
            Medicine medicine = medicineRepository.findById(mReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));
            item.setMedicine(medicine);
            item.setDosageInstruction(mReq.getDosage());
            item.setPrescription(prescription);
            return item;
        }).collect(Collectors.toList());
        prescription.setItems(items);
        String fileName = "prescription_" + System.currentTimeMillis() + ".pdf";
        String filePath = "uploads/prescriptions/" + fileName;
        generatePdf(prescription, filePath);
        prescription.setPdfFilePath(filePath);
        return prescriptionRepository.save(prescription);
    }




    private void generatePdf(Prescription p, String path) {
        try {
            File file = new File(path);
            file.getParentFile().mkdirs();

            PdfWriter writer = new PdfWriter(path);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            DeviceRgb primary = new DeviceRgb(41, 98, 255);
            DeviceRgb dark = new DeviceRgb(33, 33, 33);
            DeviceRgb lightGray = new DeviceRgb(245, 245, 245);

            // ================= UTIL: TEXT LIMIT =================
            java.util.function.Function<String, String> limitText = text -> {
                if (text == null) return "N/A";
                String[] lines = text.split("\\. ");
                StringBuilder sb = new StringBuilder();
                int count = 0;

                for (String line : lines) {
                    if (count >= 5) break;
                    sb.append(line).append(". ");
                    count++;
                }

                String result = sb.toString().trim();
                return result.length() > 300 ? result.substring(0, 297) + "..." : result;
            };

            // ================= HEADER =================
            Table header = new Table(new float[]{2, 3});
            header.setWidth(UnitValue.createPercentValue(100));

            header.addCell(new Cell()
                    .add(new Paragraph("SmartRx Hospital")
                            .setBold()
                            .setFontSize(24)
                            .setFontColor(primary))
                    .add(new Paragraph("Digital Prescription System")
                            .setFontSize(10)
                            .setFontColor(ColorConstants.GRAY))
                    .setBorder(Border.NO_BORDER));

            header.addCell(new Cell()
                    .add(new Paragraph("Prescription ID: #" + (p.getId() != null ? p.getId() : "NEW")).setBold())
                    .add(new Paragraph("Date: " + (p.getPrescriptionDate() != null ? p.getPrescriptionDate() : "N/A")))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBorder(Border.NO_BORDER));

            document.add(header);
            document.add(new Paragraph("\n"));

            // ================= DOCTOR BOX =================
            Table doctorBox = new Table(new float[]{1, 1});
            doctorBox.setWidth(UnitValue.createPercentValue(100));

            doctorBox.addCell(new Cell()
                    .add(new Paragraph("Doctor Information").setBold().setFontColor(primary))
                    .add(new Paragraph(p.getDoctorName() != null ? "Dr. " + p.getDoctorName() : "N/A"))
                    .setBackgroundColor(lightGray)
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10));

            doctorBox.addCell(new Cell()
                    .add(new Paragraph("Patient Section").setBold().setFontColor(primary))
                    .add(new Paragraph("Manual Entry Prescription"))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBackgroundColor(lightGray)
                    .setBorder(Border.NO_BORDER)
                    .setPadding(10));

            document.add(doctorBox);

            document.add(new Paragraph("Rx")
                    .setBold()
                    .setFontSize(22)
                    .setFontColor(primary)
                    .setMarginTop(15));

            // ================= MEDICINE TABLE =================
            Table table = new Table(new float[]{4, 2});
            table.setWidth(UnitValue.createPercentValue(100));

            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Medicine Details").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(primary).setPadding(8));

            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Dosage").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(primary).setPadding(8));

            for (PrescriptionItem item : p.getItems()) {

                Medicine m = item.getMedicine();
                Generic g = m.getGeneric();

                // ================= MEDICINE CELL =================
                Cell medCell = new Cell().setPadding(10);

                medCell.add(new Paragraph(m.getBrandName())
                        .setBold()
                        .setFontSize(12)
                        .setFontColor(dark));

                medCell.add(new Paragraph(g != null ? g.getGenericName() : "N/A")
                        .setFontSize(9)
                        .setFontColor(ColorConstants.GRAY));

                if (g != null) {

                    medCell.add(new Paragraph()
                            .add(new Text("Indication: ").setBold())
                            .add(limitText.apply(g.getIndicationDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Pharmacology: ").setBold())
                            .add(limitText.apply(g.getPharmacologyDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Dosage: ").setBold())
                            .add(limitText.apply(g.getDosageDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Side Effects: ").setBold())
                            .add(limitText.apply(g.getSideEffectsDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Contraindications: ").setBold())
                            .add(limitText.apply(g.getContraindicationsDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Pregnancy & Lactation: ").setBold())
                            .add(limitText.apply(g.getPregnancyAndLactationDescription()))
                            .setFontSize(8));

                    medCell.add(new Paragraph()
                            .add(new Text("Storage: ").setBold())
                            .add(limitText.apply(g.getStorageConditionsDescription()))
                            .setFontSize(8));
                }

                table.addCell(medCell);

                // ================= DOSAGE =================
                table.addCell(new Cell()
                        .add(new Paragraph(item.getDosageInstruction() != null ? item.getDosageInstruction() : "N/A")
                                .setBold()
                                .setTextAlignment(TextAlignment.CENTER))
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setBackgroundColor(new DeviceRgb(235, 245, 255))
                        .setPadding(10));
            }

            document.add(table);

            // ================= FOOTER =================
            document.add(new Paragraph("\n* Auto-generated prescription (summary view). Full details stored in system.")
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY));

            document.add(new Paragraph("SmartRx Digital Healthcare System")
                    .setFontSize(7)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.LIGHT_GRAY));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("PDF Generation Failed: " + e.getMessage());
        }
    }




    public PrescriptionDetailsDTO getPrescriptionDetails(Long id, User user) {
        Prescription p = prescriptionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (!p.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        List<MedicineDetailDTO> meds = p.getItems().stream().map(item -> {
            Medicine m = item.getMedicine();
            MedicineDetailDTO dto = new MedicineDetailDTO();
            dto.setBrandId(m.getId());
            dto.setBrandName(m.getBrandName());
            dto.setType(m.getType());
            dto.setDosageForm(m.getDosageForm());
            dto.setStrength(m.getStrength());
            dto.setManufacturerName(
                    m.getManufacturer() != null ? m.getManufacturer().getManufacturerName() : "N/A"
            );


            if (m.getGeneric() != null) {
                dto.setGenericName(m.getGeneric().getGenericName());
                dto.setIndication(m.getGeneric().getIndicationDescription());
                dto.setPharmacology(m.getGeneric().getPharmacologyDescription());
                dto.setDosageDescription(m.getGeneric().getDosageDescription());
                dto.setSideEffects(m.getGeneric().getSideEffectsDescription());
                dto.setContraindications(m.getGeneric().getContraindicationsDescription());
                dto.setPregnancyAndLactation(m.getGeneric().getPregnancyAndLactationDescription());
                dto.setStorageConditions(m.getGeneric().getStorageConditionsDescription());
            }
            return dto;
        }).toList();

        return new PrescriptionDetailsDTO(
                p.getId(),
                p.getDoctorName(),
                p.getPrescriptionDate().toString(),
                p.getPdfFilePath(),
                meds
        );
    }



    public List<Map<String, Object>> getAllForUser() {

        CustomUserDetails principal =
                (CustomUserDetails) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = principal.getUser();

        return prescriptionRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(user.getId()))
                .map(p -> {

                    Map<String, Object> map = new HashMap<>();

                    map.put("id", p.getId());
                    map.put("doctorName", p.getDoctorName());
                    map.put("date", p.getPrescriptionDate().toString());

                    List<String> meds = p.getItems().stream()
                            .map(i -> i.getMedicine().getBrandName())
                            .toList();

                    map.put("medicines", meds);

                    return map;
                })
                .toList();
    }

}