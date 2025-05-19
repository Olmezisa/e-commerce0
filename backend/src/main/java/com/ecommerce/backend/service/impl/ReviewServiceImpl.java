package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.dto.ReviewResponse;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Review;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ReviewRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             ProductRepository productRepository,
                             UserRepository userRepository) {
        this.reviewRepository  = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository    = userRepository;
    }

    @Override
    public void saveReview(ReviewRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Kullanıcı bulunamadı"));

        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Ürün bulunamadı"));

        Review review = new Review();
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setDate(LocalDate.now().toString());
        review.setUser(user);
        review.setProduct(product);

        reviewRepository.save(review);

        
    List<Review> reviews = reviewRepository.findByProductId(product.getId());
    double avg = reviews.stream()
        .mapToInt(Review::getRating)
        .average()
        .orElse(0.0);

    product.setRating((int) Math.round(avg));
    productRepository.save(product);
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
            .map(r -> new ReviewResponse(
                r.getUser().getFullName(),
                r.getDate(),
                r.getRating(),
                r.getComment()
            ))
            .collect(Collectors.toList());
    }
}
