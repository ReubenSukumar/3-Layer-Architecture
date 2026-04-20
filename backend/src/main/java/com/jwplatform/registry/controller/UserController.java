package com.jwplatform.registry.controller;

import com.jwplatform.registry.dto.CreateUserRequest;
import com.jwplatform.registry.dto.UserEnvelopeResponse;
import com.jwplatform.registry.dto.UsersResponse;
import com.jwplatform.registry.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UsersResponse getUsers() {
        return userService.getUsers();
    }

    @PostMapping
    public ResponseEntity<UserEnvelopeResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserEnvelopeResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
