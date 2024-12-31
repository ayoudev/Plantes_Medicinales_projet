package com.pfa.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class CommentaireDTO {

    private Long id;
    private String auteur;
    private String contenu;
    private LocalDateTime datePublication;
    private Long articleId;  // ID de la plante associée
 }
