package com.tmukimi.prescription.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medicines", indexes = {@Index(name = "idx_generic", columnList = "generic_name")})
@Getter
@Setter
@NoArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brandName;

    @Column(nullable = false)
    private String genericName;

    private String medicineType;
    private String strength;

    @Column(columnDefinition = "TEXT")
    private String sideEffects;

    @Column(columnDefinition = "TEXT")
    private String indications;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}