package com.oumaimabimesmaren.studentsystem.service.impl;

import com.oumaimabimesmaren.studentsystem.dto.PromoCodeDTO;
import com.oumaimabimesmaren.studentsystem.dto.PromoCodeResponseDTO;
import com.oumaimabimesmaren.studentsystem.mapper.PromoCodeMapper;
import com.oumaimabimesmaren.studentsystem.model.PromoCode;
import com.oumaimabimesmaren.studentsystem.repository.PromoCodeRepository;
import com.oumaimabimesmaren.studentsystem.service.PromoCodeService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeServiceImpl(PromoCodeRepository promoCodeRepository) {
        this.promoCodeRepository = promoCodeRepository;
    }

    @Override
    public PromoCodeResponseDTO createPromo(PromoCodeDTO dto) {
        PromoCode promo = PromoCodeMapper.toEntity(dto);
        return PromoCodeMapper.toDTO(promoCodeRepository.save(promo));
    }

    @Override
    public List<PromoCodeResponseDTO> getAllPromos() {
        return promoCodeRepository.findAll().stream()
                .map(PromoCodeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PromoCodeResponseDTO getPromoById(Long id) {
        PromoCode promo = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promo code not found"));
        return PromoCodeMapper.toDTO(promo);
    }


    @Override
    public void deletePromo(Long id) {
        promoCodeRepository.deleteById(id); // or mark as inactive if using soft delete
    }

    @Override
    public boolean isValidPromoCode(String code) {
        Optional<PromoCode> promo = promoCodeRepository.findByCode(code);
        return promo.isPresent() && promo.get().getExpirationDate().isAfter(LocalDate.now());
    }
}
