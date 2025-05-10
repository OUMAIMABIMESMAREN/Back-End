package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.FeedbackResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Feedback;

public class FeedbackMapper {
    public static FeedbackResponseDTO toDTO(Feedback feedback) {
        FeedbackResponseDTO dto = new FeedbackResponseDTO();
        dto.setId(feedback.getId());
        dto.setContent(feedback.getContent());
        dto.setFeedbackDate(feedback.getFeedbackDate());

        dto.setParticipantId(feedback.getParticipant().getId());
        String fullName = feedback.getParticipant().getF_name() + " " + feedback.getParticipant().getL_name();
        dto.setParticipantName(fullName); // Assumes getName()

        dto.setPublicationId(feedback.getPublication().getId());
        dto.setPublicationTitle(feedback.getPublication().getContent()); // Assumes getTitle()

        return dto;
    }
}
