package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.MessageResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.Message;

public class MessageMapper {
    public static MessageResponseDTO toDTO(Message message) {
        MessageResponseDTO dto = new MessageResponseDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderName(message.getSender().getF_name() + " " + message.getSender().getL_name());
        dto.setReceiverName(message.getReceiver().getF_name() + " " + message.getReceiver().getL_name());
        dto.setSentDate(message.getSentDate());
        dto.setRead(message.isRead());
        return dto;
    }
}
