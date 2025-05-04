package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.FeedbackDTO;
import com.oumaimabimesmaren.studentsystem.model.Feedback;
import com.oumaimabimesmaren.studentsystem.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired private FeedbackService feedbackService;

    @PostMapping
    public Feedback addFeedback(@RequestBody FeedbackDTO dto) {
        return feedbackService.addFeedback(dto.getParticipantId(), dto.getPublicationId(), dto.getContent());
    }

    @PutMapping("/{feedbackId}")
    public Feedback updateFeedback(
            @PathVariable Long feedbackId,
            @RequestBody String newContent) {
        return feedbackService.updateFeedback(feedbackId, newContent);
    }

    @DeleteMapping("/{feedbackId}")
    public void deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
    }

    @GetMapping("/publication/{publicationId}")
    public List<Feedback> getByPublication(@PathVariable Long publicationId) {
        return feedbackService.getFeedbacksByPublication(publicationId);
    }

    @GetMapping("/participant/{participantId}")
    public List<Feedback> getByParticipant(@PathVariable Long participantId) {
        return feedbackService.getFeedbacksByParticipant(participantId);
    }
}
