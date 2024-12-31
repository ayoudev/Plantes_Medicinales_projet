package com.pfa.backend.service;

import com.pfa.backend.entity.Commentaire;
import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.ArticleRepository;
import com.pfa.backend.repository.CommentaireRepository;
import com.pfa.backend.repository.PlanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final ArticleRepository articleRepository;

    @Autowired
    public CommentaireService(CommentaireRepository commentaireRepository, ArticleRepository articleRepository) {
        this.commentaireRepository = commentaireRepository;
        this.articleRepository = articleRepository;
    }

    // Récupérer tous les commentaires
    public List<Commentaire> getAllCommentaires() {
        return commentaireRepository.findAll();
    }

    // Récupérer un commentaire par ID
    public Optional<Commentaire> getCommentaireById(Long id) {
        return commentaireRepository.findById(id);
    }

    // Ajouter un nouveau commentaire
    public Optional<Commentaire> addCommentaireToArticle(Long articleId, Commentaire commentaire) {
        return articleRepository.findById(articleId).map(article -> {
            commentaire.setArticle(article);
            return commentaireRepository.save(commentaire);
        });
    }
    public List<Commentaire> getCommentairesByArticleId(Long articleId) {
        return commentaireRepository.findByArticleId(articleId);
    }
    // Mettre à jour un commentaire existant
    public Optional<Commentaire> updateCommentaire(Long id, Commentaire updatedCommentaire) {
        return commentaireRepository.findById(id).map(existingCommentaire -> {
            existingCommentaire.setAuteur(updatedCommentaire.getAuteur());
            existingCommentaire.setContenu(updatedCommentaire.getContenu());
            existingCommentaire.setDatePublication(updatedCommentaire.getDatePublication());
            return commentaireRepository.save(existingCommentaire);
        });
    }

    // Supprimer un commentaire
    public void deleteCommentaire(Long id) {
        commentaireRepository.deleteById(id);
    }
}