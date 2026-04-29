package com.tmukimi.prescription.repositories;

import com.tmukimi.prescription.entities.Medicine;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE " +
            "LOWER(m.brandName) LIKE LOWER(concat(:q, '%')) OR " +
            "LOWER(m.generic.genericName) LIKE LOWER(concat(:q, '%'))")
    List<Medicine> findSuggestions(@Param("q") String q, Pageable pageable);
}