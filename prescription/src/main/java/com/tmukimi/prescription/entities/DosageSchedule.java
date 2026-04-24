package com.tmukimi.prescription.entities;

import com.tmukimi.prescription.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "dosage_schedules")
@Getter
@Setter
@NoArgsConstructor
public class DosageSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_item_id", nullable = false)
    private PrescriptionItem prescriptionItem;

    @Column(nullable = false)
    private LocalTime scheduledTime;

    @Enumerated(EnumType.STRING)
    private ScheduleStatus status = ScheduleStatus.PENDING;

    private LocalDateTime lastNotifiedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}