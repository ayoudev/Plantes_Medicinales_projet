package com.pfa.backend.controller;

import com.pfa.backend.dto.CommentaireDTO;
import com.pfa.backend.entity.Commentaire;
import com.pfa.backend.entity.Plante;
import com.pfa.backend.repository.PlanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pfa.backend.dto.ArticleDTO;
import com.pfa.backend.entity.Article;
import com.pfa.backend.service.ArticleService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    @Autowired
    private PlanteRepository planteRepository; // Injection du repository de la plante

    // Convertir un Article en ArticleDTO
    private ArticleDTO convertToDTO(Article article) {
        ArticleDTO articleDTO = new ArticleDTO();
        articleDTO.setId(article.getId());
        articleDTO.setTitre(article.getTitre());
        articleDTO.setContenu(article.getContenu());
        articleDTO.setPlanteId(article.getPlante() != null ? article.getPlante().getId() : null); // Récupérer l'ID de la plante associée
        // Convertir l'image en base64
        // Vérifier si les commentaires sont null avant d'utiliser stream()
        if (article.getCommentaires() != null) {
            articleDTO.setCommentaires(article.getCommentaires().stream()
                    .map(this::convertCommentaireToDTO)
                    .toList());
        } else {
            articleDTO.setCommentaires(List.of()); // Liste vide si les commentaires sont null
        }        // Convertir l'image en base64 si elle n'est pas null
        if (article.getImage() != null) {
            String base64Image = Base64.getEncoder().encodeToString(article.getImage());
            articleDTO.setImage(base64Image);
        } else {
            articleDTO.setImage(null); // Ou une valeur par défaut si l'image est null
        }
        return articleDTO;
    }
    private CommentaireDTO convertCommentaireToDTO(Commentaire commentaire) {
        CommentaireDTO dto = new CommentaireDTO();
        dto.setId(commentaire.getId());
        dto.setAuteur(commentaire.getAuteur());
        dto.setContenu(commentaire.getContenu());
        dto.setDatePublication(commentaire.getDatePublication());
        dto.setArticleId(commentaire.getArticle().getId());
        return dto;
    }


    @GetMapping
    public List<ArticleDTO> getAllArticles() {
        List<Article> articles = articleService.getAllArticles();
        return articles.stream().map(this::convertToDTO).collect(Collectors.toList());
    }



    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(
            @RequestParam("titre") String titre,
            @RequestParam("contenu") String contenu,
            @RequestParam("planteId") Long planteId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Créer un nouvel article avec les données fournies
        Article article = new Article();
        article.setTitre(titre);
        article.setContenu(contenu);

        // Associer la plante
        Plante plante = planteRepository.findById(planteId)
                .orElseThrow(() -> new RuntimeException("Plante introuvable avec l'ID : " + planteId));
        article.setPlante(plante);

        // Si une image a été téléchargée, la convertir en tableau de bytes
        if (imageFile != null && !imageFile.isEmpty()) {
            article.setImage(imageFile.getBytes());
        }

        // Enregistrer l'article
        Article savedArticle = articleService.createArticle(article, planteId);

        // Convertir l'article en ArticleDTO
        ArticleDTO articleDTO = convertToDTO(savedArticle);

        return ResponseEntity.status(HttpStatus.CREATED).body(articleDTO);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDTO> updateArticle(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam("contenu") String contenu,
            @RequestParam(value = "planteId", required = false) Long planteId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        // Récupérer l'article existant
        Article existingArticle = articleService.getArticleById(id)
                .orElseThrow(() -> new RuntimeException("Article introuvable avec l'ID : " + id));

        // Mettre à jour les champs de l'article
        existingArticle.setTitre(titre);
        existingArticle.setContenu(contenu);

        // Mettre à jour l'image si une nouvelle image est envoyée
        if (imageFile != null && !imageFile.isEmpty()) {
            existingArticle.setImage(imageFile.getBytes());
        }

        // Mettre à jour la plante associée si un ID est fourni
        if (planteId != null) {
            Plante plante = planteRepository.findById(planteId)
                    .orElseThrow(() -> new RuntimeException("Plante introuvable avec l'ID : " + planteId));
            existingArticle.setPlante(plante);
        }

        // Sauvegarder les modifications
        Article updatedArticle = articleService.updateArticle(existingArticle);

        // Convertir l'article mis à jour en ArticleDTO
        ArticleDTO articleDTO = convertToDTO(updatedArticle);

        return ResponseEntity.ok(articleDTO);
    }

    @GetMapping("/filterByPlante/{planteId}")
    public List<ArticleDTO> filterByPlante(@PathVariable Long planteId) {
        List<Article> articles = articleService.getArticlesByPlanteId(planteId);
        return articles.stream().map(this::convertToDTO).collect(Collectors.toList());
    }



    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticleById(@PathVariable Long id) {
        return articleService.getArticleById(id)
                .map(article -> ResponseEntity.ok(convertToDTO(article)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count")
    public ResponseEntity<String> testService() {
        long count = articleService.countArticles();
        return ResponseEntity.ok(String.valueOf(count));
    }





}