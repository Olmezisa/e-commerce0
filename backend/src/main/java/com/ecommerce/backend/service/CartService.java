package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.CartItem;
import java.security.Principal;
import java.util.List;

public interface CartService {
    void addToCart(Long productId, int quantity, Long variantId, Principal principal);
    List<CartItem> getCartItems(Principal principal);
    void removeFromCart(Long productId, Long variantId, Principal principal);
    void clearCart(Principal principal);

}