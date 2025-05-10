package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.FeedbackDTO;
import com.oumaimabimesmaren.studentsystem.dto.FeedbackResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.FeedbackMapper;
import com.oumaimabimesmaren.studentsystem.model.Feedback;
import com.oumaimabimesmaren.studentsystem.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired private FeedbackService feedbackService;

    @PostMapping("/add")
    public ResponseEntity<FeedbackResponseDTO> addFeedback(@RequestBody FeedbackDTO dto) {
        Feedback feedback = feedbackService.addFeedback(dto.getParticipantId(), dto.getPublicationId(), dto.getContent());
        FeedbackResponseDTO responseDTO = FeedbackMapper.toDTO(feedback);
        return ResponseEntity.ok(responseDTO);
    }


    @PutMapping("/{feedbackId}/update")
    public ResponseEntity<FeedbackResponseDTO> updateFeedback(
            @PathVariable Long feedbackId,
            @RequestBody String newContent) {

        Feedback updatedFeedback = feedbackService.updateFeedback(feedbackId, newContent);
        FeedbackResponseDTO responseDTO = FeedbackMapper.toDTO(updatedFeedback);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{feedbackId}/delete")
    public void deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
    }

    @GetMapping("/publication/{publicationId}")
    public ResponseEntity<List<FeedbackResponseDTO>> getByPublication(@PathVariable Long publicationId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByPublication(publicationId);
        List<FeedbackResponseDTO> responseDTOs = feedbacks.stream()
                .map(FeedbackMapper::toDTO)
                .toList();

        return ResponseEntity.ok(responseDTOs);
    }


    @GetMapping("/participant/{participantId}")
    public ResponseEntity<List<FeedbackResponseDTO>> getByParticipant(@PathVariable Long participantId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByParticipant(participantId);
        List<FeedbackResponseDTO> responseDTOs = feedbacks.stream()
                .map(FeedbackMapper::toDTO)
                .toList();

        return ResponseEntity.ok(responseDTOs);
    }

}
