package com.jwplatform.registry.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class CreateUserRequest {

    @NotBlank(message = "Name is required.")
    private String name;

    @NotNull(message = "Latitude is required.")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90.")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90.")
    private Double latitude;

    @NotNull(message = "Longitude is required.")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180.")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180.")
    private Double longitude;

    @NotNull(message = "Excommunicado date is required.")
    private Instant excommunicadoAt;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Instant getExcommunicadoAt() {
        return excommunicadoAt;
    }

    public void setExcommunicadoAt(Instant excommunicadoAt) {
        this.excommunicadoAt = excommunicadoAt;
    }
}
