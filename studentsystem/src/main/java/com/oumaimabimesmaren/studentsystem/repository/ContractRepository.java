package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByOrganizerId(Long organizerId);
}
