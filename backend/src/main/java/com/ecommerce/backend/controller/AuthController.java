package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.SellerRegistrationRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request); 
        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        UserResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
       @PostMapping("/register-seller")
    public ResponseEntity<UserResponse> registerSeller(@RequestBody @Validated SellerRegistrationRequest request) {
        UserResponse response = authService.registerSeller(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
   

    
}

