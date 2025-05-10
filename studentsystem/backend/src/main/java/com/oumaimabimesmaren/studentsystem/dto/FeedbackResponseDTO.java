package com.oumaimabimesmaren.studentsystem.dto;

import lombok.Data;

import java.util.Date;
@Data
public class FeedbackResponseDTO {
    private Long id;
    private String content;
    private Date feedbackDate;

    private Long participantId;
    private String participantName; // assuming Participant has a name

    private Long publicationId;
    private String publicationTitle; // assuming Publication has a title
}
