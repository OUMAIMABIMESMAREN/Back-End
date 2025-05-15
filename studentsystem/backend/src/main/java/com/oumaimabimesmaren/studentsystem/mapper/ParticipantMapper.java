package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.ParticipantCreateDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantDTO;
import com.oumaimabimesmaren.studentsystem.dto.ParticipantResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Participant;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ParticipantMapper {

    public ParticipantDTO toDto(Participant participant) {
        if (participant == null) {
            return null;
        }

        ParticipantDTO dto = new ParticipantDTO();
        dto.setId(participant.getId());
        dto.setFullName(participant.getF_name() + " " + participant.getL_name());
        dto.setEmail(participant.getEmail());
        dto.setAttendanceStatus(participant.getAttendanceStatus());

        return dto;
    }

    public Participant toEntity(ParticipantDTO participantDTO) {
        if (participantDTO == null) {
            return null;
        }

        Participant participant = new Participant();
        // Don't set ID for new entities (let DB generate it)
        if (participantDTO.getId() != null) {
            participant.setId(participantDTO.getId());
        }

        // Handle name splitting
        if (participantDTO.getFullName() != null) {
            String[] names = participantDTO.getFullName().split(" ", 2);
            participant.setF_name(names[0]);
            participant.setL_name(names.length > 1 ? names[1] : "");
        }

        participant.setEmail(participantDTO.getEmail());
        participant.setAttendanceStatus(participantDTO.getAttendanceStatus());

        return participant;
    }

    // 1. Mapping from CreateDTO → Entity
    public Participant toEntity(ParticipantCreateDTO participantCreateDTO) {
        if (participantCreateDTO == null) {
            return null;
        }

        Participant participant = new Participant();
        participant.setF_name(participantCreateDTO.getF_name());
        participant.setL_name(participantCreateDTO.getL_name());
        participant.setBirthDate(LocalDate.parse(participantCreateDTO.getBirthDate()));
        participant.setEmail(participantCreateDTO.getEmail());
        participant.setPassword(participantCreateDTO.getPassword());
        participant.setPhone_num(participantCreateDTO.getPhone_num());
        participant.setVille(participantCreateDTO.getVille());
        participant.setAddress(participantCreateDTO.getAddress());
        participant.setRole(participantCreateDTO.getRole());
        participant.setProfilPic(participantCreateDTO.getProfilPic());
        participant.setAttendanceStatus(participantCreateDTO.getAttendanceStatus());
        // Handle eventId if needed

        return participant;
    }

    public ParticipantResponseDTO toResponseDTO(Participant participant) {
        if (participant == null) {
            return null;
        }

        ParticipantResponseDTO dto = new ParticipantResponseDTO();
        dto.setId(participant.getId());
        dto.setFirstName(participant.getF_name());
        dto.setLastName(participant.getL_name());
        dto.setEmail(participant.getEmail());
        dto.setPhone(participant.getPhone_num());
        dto.setCity(participant.getVille());
        dto.setCountry(participant.getCountry());
        dto.setAddress(participant.getAddress());
        dto.setPhoto(participant.getProfilPic());
        dto.setNewsletterFrequency(participant.getNewsletterFrequency());
        return dto;
    }
}