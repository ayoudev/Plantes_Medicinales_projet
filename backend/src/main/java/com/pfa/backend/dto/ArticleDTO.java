package com.pfa.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ArticleDTO {

    private Long id;
    private String titre;
    private String contenu;
    private Long planteId; // ID de la plante associée à l'article (au lieu de l'entité complète)
    private String image;  // Image encodée en base64
    private List<CommentaireDTO> commentaires;

}

