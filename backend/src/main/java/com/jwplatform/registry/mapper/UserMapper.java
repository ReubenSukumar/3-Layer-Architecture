package com.jwplatform.registry.mapper;

import com.jwplatform.registry.dto.CreateUserRequest;
import com.jwplatform.registry.dto.UserResponse;
import com.jwplatform.registry.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName().trim());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setExcommunicadoAt(request.getExcommunicadoAt());
        return user;
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getLatitude(),
                user.getLongitude(),
                user.getExcommunicadoAt(),
                user.getCreatedAt()
        );
    }
}
