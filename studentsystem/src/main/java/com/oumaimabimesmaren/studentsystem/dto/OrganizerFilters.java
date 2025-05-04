package com.oumaimabimesmaren.studentsystem.dto;

import jakarta.validation.constraints.*;

public class OrganizerFilters {
    @Size(max = 100, message = "Location must be less than 100 characters")
    private String location;
    private String query;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.0")
    private Double minRating;

    @Size(max = 50, message = "Organization type must be less than 50 characters")
    private String organizationType;

    // Getters and Setters
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }

    public String getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(String organizationType) {
        this.organizationType = organizationType;
    }

    @Override
    public String toString() {
        return "OrganizerFilters{" +
                "location='" + location + '\'' +
                ", query=" + query +
                ", minRating=" + minRating +
                ", organizationType='" + organizationType + '\'' +
                '}';
    }
}