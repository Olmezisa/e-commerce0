package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.SellerRegistrationRequest;
import com.ecommerce.backend.dto.UserResponse;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.security.JwtService;
import com.ecommerce.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole()); // Enum dikkat!

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return new UserResponse(
            user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                jwtToken,
                user.getActive()
        );
    }

    @Override
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(user);

        return new UserResponse(
            user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                jwtToken,
                user.getActive()
        );
    }

    @Override
    public UserResponse registerSeller(SellerRegistrationRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("Email already in use");
        }
            User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.SELLER);
        user.setActive(true);
        user.setCorporate(Boolean.TRUE.equals(request.getCorporate()));
        if (user.getCorporate()) {
            user.setBrandName(request.getBrandName());
        }
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return new UserResponse(
            saved.getId(),
            saved.getFullName(),
            saved.getEmail(),
            saved.getRole().name(),
            token,
            saved.getActive()
        );    
        
    }
    @Override
    public long countUsers() {
        return userRepository.count();
    }  
}
