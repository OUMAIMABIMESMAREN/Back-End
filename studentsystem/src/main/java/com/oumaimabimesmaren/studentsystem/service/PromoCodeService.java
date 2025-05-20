package com.oumaimabimesmaren.studentsystem.service;

import com.oumaimabimesmaren.studentsystem.dto.PromoCodeDTO;
import com.oumaimabimesmaren.studentsystem.dto.PromoCodeResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.PromoCode;

import java.util.List;

public interface PromoCodeService {
    PromoCodeResponseDTO createPromo(PromoCodeDTO dto);
    List<PromoCodeResponseDTO> getAllPromos();
    PromoCodeResponseDTO getPromoById(Long id);
    void deletePromo(Long id);
    boolean isValidPromoCode(String code);
}
