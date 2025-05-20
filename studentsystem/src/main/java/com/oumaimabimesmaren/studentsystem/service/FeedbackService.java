package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.model.Feedback;
import java.util.List;

public interface FeedbackService {
    Feedback addFeedback(Long participantId, Long publicationId, String content);
    Feedback updateFeedback(Long feedbackId, String newContent);
    void deleteFeedback(Long feedbackId);
    List<Feedback> getFeedbacksByPublication(Long publicationId);
    List<Feedback> getFeedbacksByParticipant(Long participantId);
}