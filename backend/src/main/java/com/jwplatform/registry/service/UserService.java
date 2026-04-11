package com.jwplatform.registry.service;

import com.jwplatform.registry.dto.CreateUserRequest;
import com.jwplatform.registry.dto.UserEnvelopeResponse;
import com.jwplatform.registry.dto.UserResponse;
import com.jwplatform.registry.dto.UsersResponse;
import com.jwplatform.registry.entity.User;
import com.jwplatform.registry.mapper.UserMapper;
import com.jwplatform.registry.repository.UserRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UsersResponse getUsers() {
        List<UserResponse> users = userRepository.findAll(Sort.by(
                        Sort.Order.desc("createdAt"),
                        Sort.Order.desc("id")
                ))
                .stream()
                .map(UserMapper::toResponse)
                .toList();

        log.debug("Returning {} users from registry", users.size());
        return new UsersResponse(users);
    }

    @Transactional
    public UserEnvelopeResponse createUser(CreateUserRequest request) {
        User user = UserMapper.toEntity(request);
        User savedUser = userRepository.save(user);
        log.info("Created registry user with id={} and name={}", savedUser.getId(), savedUser.getName());
        return new UserEnvelopeResponse(UserMapper.toResponse(savedUser));
    }
}
