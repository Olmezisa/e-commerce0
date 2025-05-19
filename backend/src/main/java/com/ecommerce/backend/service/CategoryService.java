package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(String name);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category updateCategory(Long id, String newName);

    void deleteCategory(Long id);
}
