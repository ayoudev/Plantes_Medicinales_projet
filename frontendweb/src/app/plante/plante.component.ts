import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Plante } from './plante.model'; // Import du modèle Plante
import { PlanteService } from './plante.service';

@Component({
  selector: 'app-plante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plante.component.html',
  styleUrls: ['./plante.component.css']
})
export class PlanteComponent implements OnInit{
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
      error: (err) => {
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

  ////////////////
    // Méthode pour soumettre le formulaire
    onSubmit(): void {
      const formData = new FormData();
      formData.append('nom', this.nom);
      if (this.description) formData.append('description', this.description);
      if (this.propriete) formData.append('propriete', this.propriete);
      if (this.utilisation) formData.append('utilisation', this.utilisation);
      if (this.precaution) formData.append('precaution', this.precaution);
      if (this.regionGeographique) formData.append('regionGeographique', this.regionGeographique);
      if (this.categorieNom) formData.append('categorieNom', this.categorieNom);
      if (this.image) formData.append('image', this.image);

      this.planteService.addPlante(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Plante ajoutée avec succès !';
          this.getPlantes(); // Rafraîchir la liste après ajout
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors de l\'ajout de la plante.';
        },
      });
    }

    // Gestion de la sélection de fichier
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.image = file;
      }
    }
  ////////////////

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }



  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }








  openAddModal(): void {
    this.showAddModal = !this.showAddModal;
  }


  openEditModal(plante: Plante): void {
    this.showUpdateModal = true;
  }

  openDeleteModal(plante: Plante): void {
    this.showDeleteConfirmModal = true; // Show the modal
  }
  closeUpdateModal(): void {
    this.showUpdateModal = false;

  }
  closeAddModal(): void {
    this.showAddModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;

  }

addPlante(): void {
    // Ajouter la nouvelle plante à la liste des plantes
    const formData = new FormData();
    formData.append('nom', this.nom);
    if (this.description) formData.append('description', this.description);
    if (this.propriete) formData.append('propriete', this.propriete);
    if (this.utilisation) formData.append('utilisation', this.utilisation);
    if (this.precaution) formData.append('precaution', this.precaution);
    if (this.regionGeographique) formData.append('regionGeographique', this.regionGeographique);
    if (this.categorieNom) formData.append('categorieNom', this.categorieNom);
    if (this.image) formData.append('image', this.image);

    this.planteService.addPlante(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Plante ajoutée avec succès !';
        this.getPlantes(); // Rafraîchir la liste après ajout
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de l\'ajout de la plante.';
      },
    });

    // Fermer le modal d'ajout
    this.closeAddModal();

    Swal.fire({
      icon: 'success',
      title: 'Utilisateur Ajouté',
      text: 'Plante ajoutée avec succès!'

    });

}

updatePlante(): void {


    // Fermer le modal d'édition
    this.closeUpdateModal();

    // Afficher une notification de succès
    Swal.fire({
      icon: 'success',
      title: 'Utilisateur Modifier',
      text: 'Plante mise à jour avec succès!'

    });


}


deletePlante(): void {



    // Afficher une notification de succès
    Swal.fire({
      icon: 'success',
      title: 'Plante supprimée avec succès!',
      showConfirmButton: false,
      timer: 1500
    });

}
}
