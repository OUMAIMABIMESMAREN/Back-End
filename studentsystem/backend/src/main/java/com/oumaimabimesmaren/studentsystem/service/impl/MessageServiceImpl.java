package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.MessageDTO;
import com.oumaimabimesmaren.studentsystem.dto.MessageResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.MessageMapper;
import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.model.User;
import com.oumaimabimesmaren.studentsystem.repository.MessageRepository;
import com.oumaimabimesmaren.studentsystem.repository.UserRepository;
import com.oumaimabimesmaren.studentsystem.service.MessageService;
import com.oumaimabimesmaren.studentsystem.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired private MessageRepository messageRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private NotificationService notificationService;

    @Override
    @Transactional
    public MessageResponseDTO sendMessage(MessageDTO dto) {
        // Find the sender and receiver
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Create a new message
        Message message = new Message();
        message.setContent(dto.getContent());
        message.setSender(sender);
        message.setReceiver(receiver);

        // Send a notification
        notificationService.sendNewMessageNotification(receiver, sender);

        // Save the message and map to DTO
        return MessageMapper.toDTO(messageRepository.save(message));
    }

    @Override
    public List<MessageResponseDTO> getInbox(Long userId) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve the messages and map to DTOs
        List<Message> messages = messageRepository.findByReceiver(user);
        return messages.stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponseDTO markAsRead(Long messageId) {
        // Find the message and mark it as read
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.markAsRead();

        // Save and map to DTO
        return MessageMapper.toDTO(messageRepository.save(message));
    }

    @Override
    @Transactional
    public void deleteMessage(Long messageId) {
        // Delete the message by ID
        messageRepository.deleteById(messageId);
    }

    @Override
    @Transactional
    public void clearInbox(Long userId) {
        // Find the user and clear their inbox
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        messageRepository.deleteByReceiver(user);
    }

    @Override
    public int getUnreadCount(Long userId) {
        // Find the user and count unread messages
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.countByReceiverAndIsReadFalse(user);
    }

    @Override
    public List<MessageResponseDTO> getSentMessages(Long userId) {
        // Find the user and retrieve their sent messages
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Message> messages = messageRepository.findBySender(user);

        // Map sent messages to DTOs
        return messages.stream()
                .map(MessageMapper::toDTO)
                .collect(Collectors.toList());
    }
}
