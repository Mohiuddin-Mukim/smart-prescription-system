package com.tmukimi.prescription.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "generics")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Generic {

    @Id
    @Column(name = "generic_id")
    private Long id;

    @Column(name = "generic_name", nullable = false)
    private String genericName;

    @Column(name = "indication_description", columnDefinition = "TEXT")
    private String indicationDescription;

    @Column(name = "therapeutic_class_description", columnDefinition = "TEXT")
    private String therapeuticClassDescription;

    @Column(name = "pharmacology_description", columnDefinition = "TEXT")
    private String pharmacologyDescription;

    @Column(name = "dosage_description", columnDefinition = "TEXT")
    private String dosageDescription;

    @Column(name = "administration_description", columnDefinition = "TEXT")
    private String administrationDescription;

    @Column(name = "interaction_description", columnDefinition = "TEXT")
    private String interactionDescription;

    @Column(name = "contraindications_description", columnDefinition = "TEXT")
    private String contraindicationsDescription;

    @Column(name = "side_effects_description", columnDefinition = "TEXT")
    private String sideEffectsDescription;

    @Column(name = "pregnancy_and_lactation_description", columnDefinition = "TEXT")
    private String pregnancyAndLactationDescription;

    @Column(name = "precautions_description", columnDefinition = "TEXT")
    private String precautionsDescription;

    @Column(name = "pediatric_usage_description", columnDefinition = "TEXT")
    private String pediatricUsageDescription;

    @Column(name = "overdose_effects_description", columnDefinition = "TEXT")
    private String overdoseEffectsDescription;

    @Column(name = "storage_conditions_description", columnDefinition = "TEXT")
    private String storageConditionsDescription;
}