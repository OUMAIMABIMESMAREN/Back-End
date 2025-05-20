package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.authentication.JwtUtil;
import com.oumaimabimesmaren.studentsystem.dto.*;
import com.oumaimabimesmaren.studentsystem.exception.UserNotFoundException;
import com.oumaimabimesmaren.studentsystem.mapper.UserMapper;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.service.AuthService;
import com.oumaimabimesmaren.studentsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/users")
public class UserControler {

    private final UserService userService;
    @Autowired private AuthService authService;
    @Autowired private JwtUtil jwtUtil;

    @Autowired
    public UserControler(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/")
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        return ResponseEntity.ok(userService.signup(newUser));
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User updatedUser, @PathVariable Long id) {
        return ResponseEntity.ok(userService.updateUser(updatedUser, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteAccount(id);
        return ResponseEntity.ok("User with id " + id + " has been deleted successfully.");
    }

    // Authentication endpoints
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@Valid @RequestBody UserSignupDTO userSignupDTO) {
        User user = UserMapper.toEntity(userSignupDTO);
        return ResponseEntity.ok(userService.signup(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequest req) {
        User user = userService.login(req.getEmail(), req.getPassword());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return ResponseEntity.ok(
                new LoginResponseDTO(token, user.getId(), user.getRole())
        );
    }


    // Additional profile update endpoint
    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable Long id,
                                              @RequestBody User profileUpdates) {
        User updatedUser = userService.updateProfile(
                id,
                profileUpdates.getF_name(),
                profileUpdates.getL_name(),
                profileUpdates.getBirthDate(),
                profileUpdates.getPhone_num(),
                profileUpdates.getVille(),
                profileUpdates.getAddress(),
                profileUpdates.getProfilPic()
        );
        return ResponseEntity.ok(updatedUser);
    }



}