package com.oumaimabimesmaren.studentsystem.dto;

import jakarta.validation.constraints.FutureOrPresent;

import java.time.LocalDate;
import java.util.Date;

public class EventSearchDTO {
    private String title;
    private String category;
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate fromDate;
    @FutureOrPresent(message = "End date must be in the future")
    private LocalDate   toDate;
    private Double minPrice;
    private Double maxPrice;
    private String location;
    private String query;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate  getFromDate() { return fromDate; }
    public void setFromDate(LocalDate  fromDate) { this.fromDate = fromDate; }
    public LocalDate  getToDate() { return toDate; }
    public void setToDate(LocalDate  toDate) { this.toDate = toDate; }
    public Double getMinPrice() { return minPrice; }
    public void setMinPrice(Double minPrice) { this.minPrice = minPrice; }
    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getDateRangeStart() {
        return fromDate;
    }

    public LocalDate getDateRangeEnd() {
        return toDate;
    }
}