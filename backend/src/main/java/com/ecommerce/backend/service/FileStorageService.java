package com.ecommerce.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    public String saveFile(MultipartFile file) {
    try {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath); // ❗ Mutlaka gerekli

        Path filePath = uploadPath.resolve(filename);
        file.transferTo(filePath.toFile());

        return "/uploads/" + filename; // frontend için kullanılabilir yol
    } catch (IOException e) {
        throw new RuntimeException("Dosya kaydedilemedi", e);
    }
}

}
