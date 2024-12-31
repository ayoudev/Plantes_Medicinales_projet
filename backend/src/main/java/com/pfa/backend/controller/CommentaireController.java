package com.pfa.backend.controller;

import com.pfa.backend.dto.CommentaireDTO;
import com.pfa.backend.entity.Commentaire;
import com.pfa.backend.security.Auth.AuthenticationService;
import com.pfa.backend.security.config.JwtService;
import com.pfa.backend.security.entity.User;
import com.pfa.backend.service.CommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commentaires")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentaireController {

    private final CommentaireService commentaireService;
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    // Injection des services nécessaires
    @Autowired
    public CommentaireController(CommentaireService commentaireService, JwtService jwtService, AuthenticationService authenticationService) {
        this.commentaireService = commentaireService;
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }
    @GetMapping("/article/{articleId}")
    public List<CommentaireDTO> getCommentairesByArticleId(@PathVariable Long articleId) {
        return commentaireService.getCommentairesByArticleId(articleId)
                .stream()
                .map(commentaire -> {
                    CommentaireDTO dto = new CommentaireDTO();
                    dto.setId(commentaire.getId());
                    dto.setAuteur(commentaire.getAuteur());
                    dto.setContenu(commentaire.getContenu());
                    dto.setDatePublication(commentaire.getDatePublication());
                    dto.setArticleId(commentaire.getArticle().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    // Récupérer tous les commentaires
    @GetMapping
    public List<Commentaire> getAllCommentaires() {
        return commentaireService.getAllCommentaires();
    }

    // Récupérer un commentaire par ID
    @GetMapping("/{id}")
    public ResponseEntity<Commentaire> getCommentaireById(@PathVariable Long id) {
        return commentaireService.getCommentaireById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ajouter un nouveau commentaire à une plante
    @PostMapping("/article/{articleId}")
    public ResponseEntity<Commentaire> ajouterCommentaire(@PathVariable Long articleId, @RequestBody CommentaireDTO commentaireDTO) {
        // Transformation du DTO en entité Commentaire
        Commentaire commentaire = new Commentaire();
        commentaire.setAuteur(commentaireDTO.getAuteur());
        commentaire.setContenu(commentaireDTO.getContenu());

        // Définir la date et l'heure de publication à la date et l'heure actuelles
        commentaire.setDatePublication(LocalDateTime.now()); // Utilisation de LocalDateTime pour la date et l'heure actuelles

        // Appel du service pour ajouter le commentaire
        Optional<Commentaire> commentaireAdded = commentaireService.addCommentaireToArticle(articleId, commentaire);

        // Vérifier si le commentaire a été ajouté avec succès
        if (commentaireAdded.isPresent()) {
            return new ResponseEntity<>(commentaireAdded.get(), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Si l'article avec cet ID n'existe pas
        }
    }

    // Mettre à jour un commentaire existant
    @PutMapping("/{id}")
    public ResponseEntity<Commentaire> updateCommentaire(@PathVariable Long id, @RequestBody Commentaire updatedCommentaire) {
        Optional<Commentaire> updated = commentaireService.updateCommentaire(id, updatedCommentaire);
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Supprimer un commentaire
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.deleteCommentaire(id);
        return ResponseEntity.noContent().build();
    }
}