package com.pfa.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Plante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private String propriete;
    private String utilisation;
    private String precaution;
    private String regionGeographique;

    @ManyToOne
    @JoinColumn(name = "categorie_id", nullable = false)
    @JsonBackReference
    private Categorie categorie;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "plante_maladie",
            joinColumns = @JoinColumn(name = "plante_id"),
            inverseJoinColumns = @JoinColumn(name = "maladie_id")
    )
    private List<Maladie> maladies;

    @OneToMany(mappedBy = "plante", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Article> articles;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;
}
