package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);


    List<Product> findAllBySellerEmail(String email);
    long   countBySellerEmail(String email);
    @Query("""
  SELECT p FROM Product p
  JOIN OrderItem o ON o.product = p
  WHERE p.seller.email = :email
  GROUP BY p
  ORDER BY COUNT(o.id) DESC
  LIMIT 1
""")
Optional<Product> findTopProductBySellerEmail(@Param("email") String email);
    @Query("""
  SELECT AVG(p.price) FROM Product p
  WHERE p.seller.email = :email
""")
BigDecimal calculateAveragePriceBySellerEmail(@Param("email") String email);

List<Product> findByCategoryId(Long categoryId);
List<Product> findByCategoryName(String name);
List<Product> findByCategoryNameAndStatus(String name, ProductStatus status);


}
