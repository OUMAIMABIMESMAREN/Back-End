package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.AuthRequest;
import com.oumaimabimesmaren.studentsystem.dto.AuthResponse;
import com.oumaimabimesmaren.studentsystem.dto.JwtResponse;
import com.oumaimabimesmaren.studentsystem.dto.LoginRequest;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import com.oumaimabimesmaren.studentsystem.service.AuthService;
import com.oumaimabimesmaren.studentsystem.authentication.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;

    // Login with JWT-based authentication
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request) {
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
//
//        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authService.login(request);
//        String token = jwtUtil.generateToken(request.getEmail());
//        return ResponseEntity.ok(new JwtResponse(token));
    }

    // Optional: login that returns user data instead of token
    @PostMapping("/login/details")
    public ResponseEntity<?> loginDetails(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest);
    }

    // Registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?>  register(@RequestBody User user) {
        return authService.register(user);
    }
}
