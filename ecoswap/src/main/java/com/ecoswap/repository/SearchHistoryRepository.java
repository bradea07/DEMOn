package com.ecoswap.repository;

import com.ecoswap.model.SearchHistory;
import com.ecoswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findByUserOrderByTimestampDesc(User user);
    List<SearchHistory> findTop10ByUserOrderByTimestampDesc(User user);
}
