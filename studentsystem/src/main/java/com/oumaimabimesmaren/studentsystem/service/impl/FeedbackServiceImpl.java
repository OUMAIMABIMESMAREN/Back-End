package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.model.*;
import com.oumaimabimesmaren.studentsystem.repository.*;
import com.oumaimabimesmaren.studentsystem.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private ParticipantRepository participantRepository;
    @Autowired private PublicationRepository publicationRepository;

    @Override
    @Transactional
    public Feedback addFeedback(Long participantId, Long publicationId, String content) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication not found"));

        Feedback feedback = new Feedback();
        feedback.setParticipant(participant);
        feedback.setPublication(publication);
        feedback.setContent(content);

        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public Feedback updateFeedback(Long feedbackId, String newContent) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedback.setContent(newContent);
        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public void deleteFeedback(Long feedbackId) {
        feedbackRepository.deleteById(feedbackId);
    }

    @Override
    public List<Feedback> getFeedbacksByPublication(Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        return feedbackRepository.findByPublication(publication);
    }

    @Override
    public List<Feedback> getFeedbacksByParticipant(Long participantId) {
        return feedbackRepository.findByParticipantId(participantId);
    }
}