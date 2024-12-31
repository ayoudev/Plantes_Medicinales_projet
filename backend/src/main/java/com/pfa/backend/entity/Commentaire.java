package com.pfa.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Commentaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String auteur;
    private String contenu;
    private LocalDateTime datePublication;
    @ManyToOne
    @JoinColumn(name = "article_id")
    @JsonBackReference
    private Article article; // L'article associé
}

