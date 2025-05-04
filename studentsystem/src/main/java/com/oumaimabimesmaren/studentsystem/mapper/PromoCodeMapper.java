package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.PromoCodeDTO;
import com.oumaimabimesmaren.studentsystem.dto.PromoCodeResponseDTO;
import com.oumaimabimesmaren.studentsystem.model.PromoCode;

public class PromoCodeMapper {
    public static PromoCode toEntity(PromoCodeDTO dto) {
        PromoCode promo = new PromoCode();
        promo.setCode(dto.getCode());
        promo.setDiscount(dto.getDiscount());
        promo.setExpirationDate(dto.getExpirationDate());
        promo.setActive(true);
        return promo;
    }

    public static PromoCodeResponseDTO toDTO(PromoCode promo) {
        PromoCodeResponseDTO dto = new PromoCodeResponseDTO();
        dto.setId(promo.getId());
        dto.setCode(promo.getCode());
        dto.setDiscount(promo.getDiscount());
        dto.setExpirationDate(promo.getExpirationDate());
        dto.setActive(promo.isActive());
        return dto;
    }
}

