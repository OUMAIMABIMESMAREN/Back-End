package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.AdminDTO;
import com.oumaimabimesmaren.studentsystem.dto.AdminResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User signup(User user);
    boolean login(String email, String password);
    void logout(Long userId);
    void deleteAccount(Long userId);
    User updateProfile(Long userId, String fname, String lname, LocalDate birthDate, String phoneNum, String ville, String address, String profilPic);
    User updateUser(User updatedUser, Long id);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    List<User> findAll();


}