import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Plante } from '../../plante/plante.model'; // Import du modèle Plante
import { PlanteService } from '../../plante/plante.service';

@Component({
  selector: 'app-plant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plant.component.html',
  styleUrl: './plant.component.css'
})
export class PlantComponent {
OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';
  showDropdown: boolean = false;
  showAddModal: boolean = false;
  showUpdateModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  nom: string = '';
  description: string = '';
  propriete: string = '';
  utilisation: string = '';
  precaution: string = '';
  regionGeographique: string = '';
  categorieNom: string = '';
  image: File | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  categories: any[] = [];
  plantes: Plante[] = [];
  maladies: any[] = []; // Liste des maladies

  selectedMaladies: number[] = []; // IDs des maladies sélectionnées


  constructor(private planteService: PlanteService, private router: Router) {}

  ngOnInit(): void {
    this.loadMaladies(); // Charger les maladies

    this.getPlantes(); // Récupérer les plantes au démarrage
    this.planteService.getCategories().subscribe({
      next: (response) => {
        this.categories = response; // Récupération des catégories pour le dropdown
      },
      error: (err:any) => {
        console.error('Erreur lors de la récupération des catégories:', err);
      },
    });
  }
  // Charger les maladies depuis l'API
  loadMaladies(): void {
    this.planteService.getMaladies().subscribe({
      next: (response: any[]) => {
        this.maladies = response; // Stocker les maladies reçues
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des maladies:', err);
      },
    });
  }

  selectedMaladie: string = 'all'; // Valeur par défaut
  filterByMaladie(): void {
    if (this.selectedMaladie === 'all') {
      this.getPlantes(); // Charger toutes les plantes
    } else {
      // Filtrer les plantes en fonction de la maladie
      this.planteService.filterPlantesByMaladie(this.selectedMaladie).subscribe({
        next: (plantes) => {
          this.plantes = plantes; // Mettre à jour la liste des plantes
        },
        error: (err) => {
          console.error('Erreur lors du filtrage des plantes par maladie', err);
        },
      });
    }
  }

  filterPlantesByMaladie(maladie: string): void {
    if (maladie === 'all') {
        this.getPlantes(); // Charge toutes les plantes
    } else {
        this.planteService.filterPlantesByMaladie(maladie).subscribe({
            next: (response) => {
                this.plantes = response; // Met à jour la liste
            },
            error: (err) => {
                console.error('Erreur lors du filtrage des plantes par maladie:', err);
            },
        });
    }
  }


  // Récupérer toutes les plantes
  getPlantes(): void {
    this.planteService.getAllPlantes().subscribe({
      next: (plantes) => {
        this.plantes = plantes;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des plantes', err);
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }
}
