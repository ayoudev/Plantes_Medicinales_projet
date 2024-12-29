package com.pfa.backend.service;

import com.pfa.backend.dto.ArticleDTO;
import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.PlanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pfa.backend.entity.Article;
import com.pfa.backend.repository.ArticleRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private PlanteRepository planteRepository;

    public long countArticles() {
        return articleRepository.count();
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    public List<Article> getArticlesByPlanteId(Long planteId) {
        return articleRepository.findByPlanteId(planteId);
    }

    // Créer un nouvel article
    public Article createArticle(Article article, Long planteId) {
        if (planteId != null) {
            Plante plante = planteRepository.findById(planteId)
                    .orElseThrow(() -> new RuntimeException("Plante introuvable avec l'ID : " + planteId));
            article.setPlante(plante); // Associer la plante à l'article
        }
        return articleRepository.save(article);
    }
    // Mettre à jour un article existant
    public Article updateArticle(Article article) {
        return articleRepository.save(article);
    }



    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
