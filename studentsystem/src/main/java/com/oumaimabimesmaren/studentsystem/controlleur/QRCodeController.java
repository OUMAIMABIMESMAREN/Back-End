package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.service.QRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qrcode")
public class QRCodeController {

    @Autowired
    private QRCodeService qrCodeService;

    @GetMapping("/generate")
    public ResponseEntity<String> generateQRCode(
            @RequestParam String text,
            @RequestParam(defaultValue = "300") int width,
            @RequestParam(defaultValue = "300") int height) {
        try {
            String qrCodeImage = qrCodeService.generateQRCodeImage(text, width, height);
            return ResponseEntity.ok(qrCodeImage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to generate QR code: " + e.getMessage());
        }
    }
} 