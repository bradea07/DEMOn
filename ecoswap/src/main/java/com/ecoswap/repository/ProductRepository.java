package com.ecoswap.repository;

import com.ecoswap.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 🔍 Căutare după titlu (search bar)
    List<Product> findByTitleContainingIgnoreCase(String keyword);

    // 👤 Produse postate de un anumit user
    List<Product> findByUserId(Long userId);
}
