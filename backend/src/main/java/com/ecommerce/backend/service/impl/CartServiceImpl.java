package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.UserService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {
    private final CartItemRepository cartRepo;
    private final UserService userService;
    private final ProductService productService;

    public CartServiceImpl(CartItemRepository cartRepo,
                           UserService userService,
                           ProductService productService) {
        this.cartRepo = cartRepo;
        this.userService = userService;
        this.productService = productService;
    }

    @Override
    public void addToCart(Long productId, int quantity, Long variantId, Principal principal) {
        User user = userService.getCurrentUser();
        Product product = productService.getProductById(productId);

        ProductVariant variant = null;
        if (variantId != null) {
            variant = productService.getVariantById(variantId);
        }

        CartItem item;
        if (variant != null) {
            var opt = cartRepo.findByUserEmailAndProductIdAndVariantId(
                user.getEmail(), productId, variantId);

            if (opt.isPresent()) {
                item = opt.get();
            } else {
                item = new CartItem();
                item.setUser(user);
                item.setProduct(product);
                item.setVariant(variant);
                item.setQuantity(0);
            }
        } else {
            var opt = cartRepo.findByUserEmailAndProductId(
                user.getEmail(), productId);

            if (opt.isPresent()) {
                item = opt.get();
            } else {
                item = new CartItem();
                item.setUser(user);
                item.setProduct(product);
                item.setQuantity(0);
            }
        }

        item.setQuantity(item.getQuantity() + quantity);
        cartRepo.save(item);
    }

    @Override
    public List<CartItem> getCartItems(Principal principal) {
        User user = userService.getCurrentUser();
        return cartRepo.findByUserEmail(user.getEmail());
    }

@Override
public void removeFromCart(Long productId, Long variantId, Principal principal) {
    User user = userService.getCurrentUser();

    Optional<CartItem> optItem;
    if (variantId != null) {
        optItem = cartRepo.findByUserEmailAndProductIdAndVariantId(
            user.getEmail(), productId, variantId
        );
    } else {
        optItem = cartRepo.findByUserEmailAndProductId(
            user.getEmail(), productId
        );
    }

    optItem.ifPresent(cartRepo::delete);
}


    @Override
    public void clearCart(Principal principal) {
        User user = userService.getCurrentUser();
        cartRepo.findByUserEmail(user.getEmail())
                .forEach(cartRepo::delete);
    }
}
