package com.tmukimi.prescription.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @Column(name = "brand_id")
    private Long id;

    @Column(nullable = false)
    private String brandName;

    @Column(name = "medicine_type")
    private String type;
    private String dosageForm;
    private String strength;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generic_id")
    private Generic generic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manufacturer_id")
    private Manufacturer manufacturer;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();
}