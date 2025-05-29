package com.oumaimabimesmaren.studentsystem.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EventSearchDTO {
    private String title;
    private String category;
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDateTime fromDate;
    @FutureOrPresent(message = "End date must be in the future")
    private LocalDateTime toDate;
    @Min(0)
    private Double minPrice;
    @Min(0)
    private Double maxPrice;
    private String location;
    private String query;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public LocalDateTime getDateRangeStart() {
        return fromDate;
    }

    public LocalDateTime getDateRangeEnd() {
        return toDate;
    }
}