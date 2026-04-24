package com.tmukimi.prescription.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore   // ✅ IMPORTANT
    private User user;

    private String doctorName;
    private LocalDate prescriptionDate;
    private String pdfFilePath;
    private Boolean isManualEntry = false;
    private Integer version = 1;

    @OneToMany(mappedBy = "prescription", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PrescriptionItem> items;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}