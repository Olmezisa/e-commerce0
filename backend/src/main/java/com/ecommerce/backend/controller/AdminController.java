package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.UserService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;

    public AdminController(UserService userService, ProductService productService, OrderService orderService) {
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
    }

    @GetMapping("/users/count")
    public long countUsers() {
        return userService.countUsers();
    }

    @GetMapping("/products/count")
    public long countProducts() {
        return productService.countProducts();
    }

    @GetMapping("/orders/count")
    public long countOrders() {
        return orderService.countOrders();
    }
}
