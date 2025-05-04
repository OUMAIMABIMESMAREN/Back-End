package com.oumaimabimesmaren.studentsystem.controlleur;

import com.oumaimabimesmaren.studentsystem.dto.PromoCodeDTO;
import com.oumaimabimesmaren.studentsystem.dto.PromoCodeResponseDTO;
import com.oumaimabimesmaren.studentsystem.service.PromoCodeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promocodes")
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    public PromoCodeController(PromoCodeService promoCodeService) {
        this.promoCodeService = promoCodeService;
    }

    @PostMapping("/create")
    public PromoCodeResponseDTO createPromo(@RequestBody PromoCodeDTO promoCodeDTO) {
        return promoCodeService.createPromo(promoCodeDTO);
    }

    @GetMapping("/allpromos")
    public List<PromoCodeResponseDTO> getAllPromos() {
        return promoCodeService.getAllPromos();
    }
    @GetMapping("/validate/{code}")
    public boolean validatePromo(@PathVariable String code) {
        return promoCodeService.isValidPromoCode(code);
    }

    @GetMapping("/id/{id}")
    public PromoCodeResponseDTO getPromo(@PathVariable Long id) {
        return promoCodeService.getPromoById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePromo(@PathVariable Long id) {
        promoCodeService.deletePromo(id);
    }
}
