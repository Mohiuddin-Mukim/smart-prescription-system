package com.tmukimi.prescription.repositories;

import com.tmukimi.prescription.entities.Generic;
import com.tmukimi.prescription.entities.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenericRepository extends JpaRepository<Generic, Long> {

    Optional<Generic> findByGenericNameIgnoreCase(String genericName);


}