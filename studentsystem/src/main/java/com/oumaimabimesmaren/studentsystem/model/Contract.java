package com.oumaimabimesmaren.studentsystem.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Data
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private boolean signed;

    private LocalDateTime createdAt;

    private LocalDateTime signedAt;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;
}

