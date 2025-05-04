package com.oumaimabimesmaren.studentsystem.mapper;

import com.oumaimabimesmaren.studentsystem.dto.UserRequestDTO;
import com.oumaimabimesmaren.studentsystem.dto.UserResponseDTO;
import com.oumaimabimesmaren.studentsystem.dto.UserSignupDTO;
import com.oumaimabimesmaren.studentsystem.model.User;

public class UserMapper {

    public static User toEntity(UserSignupDTO dto) {
        User user = new User();
        user.setF_name(dto.getF_name());
        user.setL_name(dto.getL_name());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone_num(dto.getPhone_num());
        user.setVille(dto.getVille());
        user.setAddress(dto.getAddress());
        user.setBirthDate(dto.getBirthDate());
        user.setProfilPic(dto.getProfilPic());
        return user;
    }

    /*public static User toEntity(UserRequestDTO dto) {
        User user = new User();
        user.setF_name(dto.getF_name());
        user.setL_name(dto.getL_name());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }*/

    public static UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setF_name(user.getF_name());
        dto.setL_name(user.getL_name());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
