package com.oumaimabimesmaren.studentsystem.model;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    private String f_name;

    @NotBlank(message = "Last name is required")
    private String l_name;

    @Past(message = "Birthdate must be in the past")
    private LocalDate birthDate;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    private String role;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phone_num;

    @NotBlank(message = "City is required")
    private String ville;

    @NotBlank(message = "Address is required")
    private String address;

    private LocalDateTime creationDate;

    private String profilPic;

    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
    }

}
