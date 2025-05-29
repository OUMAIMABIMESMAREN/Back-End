package com.oumaimabimesmaren.studentsystem.added.dto;

import lombok.Data;

@Data
public class FilterDTO {
    private String category;
    private String location;
    private String price;
    private String searchTerm;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;
} 