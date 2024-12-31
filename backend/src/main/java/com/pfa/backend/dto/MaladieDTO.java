package com.pfa.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class MaladieDTO {
    private Long id;
    private String nom;
    private List<Long> planteIds;  // Liste des IDs de plantes associées


        private String informations;

        private String symptomes;

        private String causes;



}
