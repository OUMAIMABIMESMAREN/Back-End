package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.MessageDTO;
import com.oumaimabimesmaren.studentsystem.dto.MessageResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.model.User;
import java.util.List;

public interface MessageService {
    MessageResponseDTO sendMessage(MessageDTO dto);
    List<MessageResponseDTO> getInbox(Long userId);
    List<MessageResponseDTO> getSentMessages(Long userId);
    MessageResponseDTO markAsRead(Long messageId);
    void deleteMessage(Long messageId);
    void clearInbox(Long userId);
    int getUnreadCount(Long userId);
    Message saveMessage(Message message);
}