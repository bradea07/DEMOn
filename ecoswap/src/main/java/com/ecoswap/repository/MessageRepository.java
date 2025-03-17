package com.ecoswap.repository;
import com.ecoswap.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.product.id = :productId")
    List<Message> findByProductId(@Param("productId") Long productId);
}
