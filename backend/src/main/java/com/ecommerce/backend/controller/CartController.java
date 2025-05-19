package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartItemDto;
import com.ecommerce.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }
    

    
    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            @RequestParam(required = false) Long variantId,
            Principal principal
    ) {
        cartService.addToCart(productId, quantity, variantId, principal);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItemDto>> listCart(Principal principal) {
        List<CartItemDto> items = cartService.getCartItems(principal)
                .stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }


    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            @RequestParam Long productId,
            @RequestParam(required = false) Long variantId,
            Principal principal
    ) {
        cartService.removeFromCart(productId, variantId, principal);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal);
        return ResponseEntity.noContent().build();
    }
}
