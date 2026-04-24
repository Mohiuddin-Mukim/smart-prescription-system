package com.tmukimi.prescription.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "prescription_items")
@Getter
@Setter
@NoArgsConstructor
public class PrescriptionItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonIgnore
    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;

    private String manualMedicineName;
    private String dosageInstruction;
    private Integer durationDays;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive = true;

    @OneToMany(mappedBy = "prescriptionItem", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<DosageSchedule> schedules;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}