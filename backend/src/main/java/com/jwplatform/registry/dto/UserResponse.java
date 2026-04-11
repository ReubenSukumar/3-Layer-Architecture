package com.jwplatform.registry.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String name,
        Double latitude,
        Double longitude,
        Instant excommunicadoAt,
        Instant createdAt
) {
}
