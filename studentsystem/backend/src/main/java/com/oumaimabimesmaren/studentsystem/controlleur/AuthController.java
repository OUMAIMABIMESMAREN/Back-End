package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.authentication.UserDetailsImpl;
import com.oumaimabimesmaren.studentsystem.dto.AuthRequest;
import com.oumaimabimesmaren.studentsystem.dto.LoginRequest;
import com.oumaimabimesmaren.studentsystem.dto.LoginResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.OrganizerDTO;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.repository.OrganizerRepository;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import com.oumaimabimesmaren.studentsystem.service.AuthService;
import com.oumaimabimesmaren.studentsystem.authentication.JwtUtil;
import com.oumaimabimesmaren.studentsystem.service.TokenBlacklistService;
import com.oumaimabimesmaren.studentsystem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private OrganizerRepository organizerRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserService userService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(TokenBlacklistService tokenBlacklistService) {
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
        }

        return ResponseEntity.ok("Logged out successfully.");
    }

    // Login with JWT-based authentication
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest); // ✅ delegation
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

    @PostMapping("/organizer-register")
    public ResponseEntity<?> registerOrganizer(@RequestBody OrganizerDTO dto) {
        Organizer organizer = new Organizer();
        organizer.setF_name(dto.getF_name());
        organizer.setL_name(dto.getL_name());
        organizer.setEmail(dto.getEmail());
        organizer.setPassword(passwordEncoder.encode(dto.getPassword()));
        organizer.setPhone_num(dto.getPhone_num());
        organizer.setIdnumber(dto.getIdNumber());
        organizer.setPortfoliolink(dto.getPortfolioLink());
        organizer.setAcceptscontract(dto.isAcceptsContract());

        // save organizer using repository
        organizerRepository.save(organizer);

        return ResponseEntity.ok("Registration successful");
    }

}
