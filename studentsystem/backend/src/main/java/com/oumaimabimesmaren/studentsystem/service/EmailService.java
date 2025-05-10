package com.oumaimabimesmaren.studentsystem.service;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
}