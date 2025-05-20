package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.AdminDTO;
import com.oumaimabimesmaren.studentsystem.dto.AdminResponseDTO;
import com.oumaimabimesmaren.studentsystem.exception.ResourceNotFoundException;
import com.oumaimabimesmaren.studentsystem.model.Admin;
import com.oumaimabimesmaren.studentsystem.model.Event;
import com.oumaimabimesmaren.studentsystem.model.Organizer;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.repository.AdminRepository;
import com.oumaimabimesmaren.studentsystem.repository.EventRepository;
import com.oumaimabimesmaren.studentsystem.repository.OrganizerRepository;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final Map<Long, Boolean> activeSessions = new HashMap<>();

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User signup(User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        // Optional: mark session active here
        activeSessions.put(user.getId(), true);
        return user;                       // ✅ authenticated user
    }


    @Override
    public void logout(Long userId) {
        activeSessions.remove(userId);
    }

    @Override
    public void deleteAccount(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            userRepository.delete(user);
            activeSessions.remove(userId);
        });
    }

    @Override
    public User updateProfile(Long userId, String fname, String lname, LocalDate birthDate,
                              String phoneNum, String ville, String address, String profilPic) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (fname != null) user.setF_name(fname);
        if (lname != null) user.setL_name(lname);
        if (birthDate != null) user.setBirthDate(birthDate);
        if (phoneNum != null) user.setPhone_num(phoneNum);
        if (ville != null) user.setVille(ville);
        if (address != null) user.setAddress(address);
        if (profilPic != null) user.setProfilPic(profilPic);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(User updatedUser, Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setF_name(updatedUser.getF_name());
                    user.setL_name(updatedUser.getL_name());
                    user.setBirthDate(updatedUser.getBirthDate());
                    user.setEmail(updatedUser.getEmail());
                    // Only update password if it's being changed
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    user.setPhone_num(updatedUser.getPhone_num());
                    user.setVille(updatedUser.getVille());
                    user.setAddress(updatedUser.getAddress());
                    user.setProfilPic(updatedUser.getProfilPic());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }



}