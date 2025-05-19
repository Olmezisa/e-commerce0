package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.SellerRegistrationRequest;
import com.ecommerce.backend.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    UserResponse login(LoginRequest request);
    UserResponse registerSeller(SellerRegistrationRequest request);
    long countUsers();

}
