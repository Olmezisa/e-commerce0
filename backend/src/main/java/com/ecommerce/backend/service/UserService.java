package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.User;

public interface UserService {
    User getCurrentUser();
    Long countUsers();
    User save(User user);
}
