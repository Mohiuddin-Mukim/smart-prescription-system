package com.tmukimi.prescription.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manufacturers")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Manufacturer {

    @Id
    @Column(name = "manufacturer_id")
    private Long id;

    @Column(nullable = false)
    private String manufacturerName;
}