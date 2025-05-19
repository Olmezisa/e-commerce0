package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.VariantRequest;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductVariantRepository;
import com.ecommerce.backend.service.FileStorageService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductVariantRepository variantRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public ProductServiceImpl(
        ProductRepository productRepository,
        UserService userService,
        ProductVariantRepository variantRepository,
        CategoryRepository categoryRepository,
        FileStorageService fileStorageService
    ) {
        this.productRepository = productRepository;
        this.userService = userService;
        this.variantRepository = variantRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService=fileStorageService;
    }

    @Override
    public Product createProduct(ProductRequest request,MultipartFile imageFile) {
        Product product = new Product();
        String imageUrl = fileStorageService.saveFile(imageFile);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(imageUrl);
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setStatus(ProductStatus.PENDING);

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        product.setCategory(category);

        User seller = userService.getCurrentUser();
        product.setSeller(seller);

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        String imageUrl = fileStorageService.saveFile(request.getImage());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(imageUrl);
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setStatus(request.getStatus());

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @Override
    public void deleteProduct(Long id) {
         Product product = getProductById(id);
    product.setPreviousStatus(product.getStatus());
    product.setStatus(ProductStatus.BANNED); // silmek yerine pasif yap
    productRepository.save(product);
    }

    @Override
    public Product approveProduct(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setStatus(ProductStatus.ACTIVE);
        return productRepository.save(product);
    }

    @Override
    public Product rejectProduct(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setPreviousStatus(product.getStatus());
        product.setStatus(ProductStatus.BANNED);
        return productRepository.save(product);
    }

    @Override
    public Product unbanProduct(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setStatus(ProductStatus.ACTIVE);
        product.setPreviousStatus(null);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getProductsByStatus(ProductStatus status) {
        return productRepository.findByStatus(status);
    }

    @Override
    public Long countProducts() {
        return productRepository.count();
    }

    @Override
    public List<Product> getProductsBySellerUsername(String username) {
        return productRepository.findAllBySellerEmail(username);
    }

    @Override
    public long countProductsBySellerUsername(String username) {
        return productRepository.countBySellerEmail(username);
    }

    @Override
    public List<ProductVariant> getVariantsForProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return variantRepository.findByProductId(productId);
    }

    @Override
    public ProductVariant createVariant(Long productId, VariantRequest dto) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        ProductVariant v = new ProductVariant();
        v.setProduct(product);
        v.setSku(dto.getSku());
        v.setOptionName(dto.getOptionName());
        v.setOptionValue(dto.getOptionValue());
        v.setPrice(dto.getPrice());
        v.setStock(dto.getStock());
        v.setImageUrl(dto.getImageUrl());

        return variantRepository.save(v);
    }

    @Override
    public ProductVariant updateVariant(Long variantId, VariantRequest dto) {
        ProductVariant v = variantRepository.findById(variantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found"));

        v.setSku(dto.getSku());
        v.setOptionName(dto.getOptionName());
        v.setOptionValue(dto.getOptionValue());
        v.setPrice(dto.getPrice());
        v.setStock(dto.getStock());
        v.setImageUrl(dto.getImageUrl());

        return variantRepository.save(v);
    }

    @Override
    public void deleteVariant(Long variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found");
        }
        variantRepository.deleteById(variantId);
    }

    @Override
    public ProductVariant getVariantById(Long variantId) {
        return variantRepository.findById(variantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Variant not found"));
    }
    @Override
public Product findTopSellingProductBySeller(String email) {
    return productRepository.findTopProductBySellerEmail(email)
            .orElse(null);
}

@Override
public BigDecimal calculateAverageProductPrice(String email) {
    return productRepository.calculateAveragePriceBySellerEmail(email);
}
@Override
public List<Product> getProductsByCategory(Long categoryId) {
    return productRepository.findByCategoryId(categoryId);
}
@Override
public List<Product> getProductsByCategory(String categoryName, ProductStatus status) {
    if (status != null) {
        return productRepository.findByCategoryNameAndStatus(categoryName, status);
    }
    return productRepository.findByCategoryName(categoryName);
}
}
