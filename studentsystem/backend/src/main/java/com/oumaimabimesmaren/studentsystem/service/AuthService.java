package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.AuthRequest;
import com.oumaimabimesmaren.studentsystem.dto.AuthResponse;
import com.oumaimabimesmaren.studentsystem.model.User;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> login(AuthRequest authRequest);
    ResponseEntity<?> register(User user);
}
