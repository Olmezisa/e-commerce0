package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmail(String email);
    Optional<CartItem> findByUserEmailAndProductId(String email, Long productId);
    Optional<CartItem> findByUserEmailAndProductIdAndVariantId(String email, Long productId, Long variantId);
    void deleteByUserEmailAndProductId(String email, Long productId);
    void deleteByUserEmailAndProductIdAndVariantId(String email, Long productId, Long variantId);
}
