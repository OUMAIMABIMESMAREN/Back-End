package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.AuthRequest;
import com.oumaimabimesmaren.studentsystem.dto.AuthResponse;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import com.oumaimabimesmaren.studentsystem.service.AuthService;
import com.oumaimabimesmaren.studentsystem.authentication.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public ResponseEntity<?>  login(AuthRequest authRequest) {
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + authRequest.getEmail()));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(user.getId(),token, "Login successful!", user.getRole()));
    }

    @Override
    public ResponseEntity<?> register(User user) {
        // You may want to check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with this email");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("your account has registered successfully please procced to the login !");
    }
}
