package com.pfa.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlanteDTO {

    private Long id;
    private String nom;
    private String description;
    private String propriete;
    private String utilisation;
    private String precaution;
    private String regionGeographique;
    private Long categorieId; // Utiliser un ID pour référencer la catégorie
    private List<Long> maladieIds; // Liste des IDs des maladies associées
    private List<Long> articleIds; // Liste des IDs des articles associés
    private String imageBase64; // Représentation base64 de l'image
}
