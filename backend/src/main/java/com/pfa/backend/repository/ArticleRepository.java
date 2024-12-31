package com.pfa.backend.repository;

import com.pfa.backend.dto.ArticleDTO;
import com.pfa.backend.entity.Article;
import com.pfa.backend.entity.Plante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByPlanteId(Long planteId);
}

