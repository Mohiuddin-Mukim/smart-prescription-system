package com.tmukimi.prescription.repositories;

import com.tmukimi.prescription.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}
