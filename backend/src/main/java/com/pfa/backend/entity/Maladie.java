package com.pfa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Maladie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(length = 1000) // Description étendue pour les symptômes
    private String symptomes;


    @Column(length = 1000) // Description étendue pour les causes
    private String causes;

    @Column(length = 1000) // Description étendue pour les causes
    private String informations;

    @ManyToMany(mappedBy = "maladies", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<Plante> plantes;
}
