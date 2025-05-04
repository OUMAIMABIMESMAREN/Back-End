package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Custom queries can be added here
}