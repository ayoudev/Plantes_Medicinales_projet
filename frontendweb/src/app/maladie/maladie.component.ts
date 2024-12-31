import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MaladieService } from './maladie.service';  // Assurez-vous que le chemin est correct

// Définir l'interface pour la Maladie
interface Maladie {
  id: number;
  nom: string;
  planteIds?: number[];
  informations: string;
  symptomes: string;
  causes: string;
}

@Component({
  selector: 'app-maladie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maladie.component.html',
  styleUrls: ['./maladie.component.css']
})
export class MaladieComponent implements OnInit {
  // Chemins des images
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';

  // Variables d'état de l'interface utilisateur
  showDropdown: boolean = false;
  showAddModal: boolean = false;
  showUpdateModal: boolean = false;
  showDetailsModal = false;
  showDeleteConfirmModal: boolean = false;

  // Données du formulaire
  newMaladie: Maladie = { id: 0, nom: '', planteIds:[] , informations: '', symptomes: '', causes: '' };
  selectedMaladie: Maladie = { id: 0, nom: '',planteIds:[], informations: '', symptomes: '', causes: '' };

  // Liste des maladies
  maladie: Maladie[] = [];

  // Constructeur avec injection de dépendances
  constructor(private router: Router, private maladieService: MaladieService) {}

  // Méthode pour récupérer les maladies depuis le backend
  getMaladies(): void {
    this.maladieService.getMaladies().subscribe(
      (data) => {
        this.maladie = data;  // Affecter les données récupérées au tableau `maladie`
        console.log('Maladies récupérées:', this.maladie);
      },
      (error) => {
        console.error('Erreur lors de la récupération des maladies:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des données.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }


  // Appeler getMaladies lors de l'initialisation du composant
  ngOnInit() {
    this.getMaladies();  // Appeler la méthode pour récupérer les maladies
  }

  // Méthode pour afficher/masquer le menu déroulant
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Méthode de déconnexion
  logout(): void {
    console.log('Déconnexion...');
    this.router.navigate(['/login']);
  }

  // Méthodes pour gérer le modal d'ajout
  toggleAddModal(): void {
    this.showAddModal = !this.showAddModal;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  // Méthode pour ajouter une maladie
  addMaladie(): void {
    if (this.newMaladie.nom && this.newMaladie.informations && this.newMaladie.symptomes && this.newMaladie.causes) {
      // Si planteIds n'est pas défini, il sera initialisé en tableau vide
      this.newMaladie.planteIds = [];

      this.maladieService.addMaladie(this.newMaladie).subscribe(
        (response) => {
          this.maladie.push(response);
          this.newMaladie = { id: 0, nom: '', planteIds: [], informations: '', symptomes: '', causes: '' };

          this.getMaladies();
          Swal.fire({
            title: 'Succès',
            text: 'La maladie a été ajoutée avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de la maladie.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Erreur lors de l\'ajout de la maladie:', error);
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }


  // Méthode pour mettre à jour une maladie
  updateMaladie(): void {
    if (this.selectedMaladie) {
      this.maladieService.updateMaladie(this.selectedMaladie.id, this.selectedMaladie).subscribe(
        (response) => {
          console.log('Maladie mise à jour avec succès:', response);
          Swal.fire({
            title: 'Succès',
            text: 'La maladie a été mise à jour avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
           // Rafraîchir la liste des maladies après mise à jour
           this.getMaladies();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la maladie:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la mise à jour de la maladie.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Aucune maladie sélectionnée pour la mise à jour.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }


  // Méthode pour supprimer une maladie
deleteMaladie(): void {
  if (this.selectedMaladie) {
    this.maladieService.deleteMaladie(this.selectedMaladie.id).subscribe(
      (response) => {
        // Supprimer la maladie de la liste
        const index = this.maladie.findIndex(m => m.id === this.selectedMaladie!.id);
        if (index > -1) {
          this.maladie.splice(index, 1);
        }
        this.getMaladies();

        // Afficher une alerte de succès
        Swal.fire({
          icon: 'success',
          title: 'La maladie a été supprimée avec succès.',
          showConfirmButton: false,
          timer: 1500
        });

        console.log('Maladie supprimée:', this.selectedMaladie);
      },
      (error) => {
        // Afficher une alerte d'erreur
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression de la maladie.',
          icon: 'error',
          confirmButtonText: 'OK'
        });

        console.error('Erreur lors de la suppression de la maladie:', error);
      }
    );
  }
  this.closeDeleteModal();
}


  // Méthodes pour gérer le modal d'édition
  openEditModal(maladie: Maladie): void {
    this.selectedMaladie = { ...maladie };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedMaladie = { id: 0, nom: '', informations: '', symptomes: '', causes: '' };
  }

  // Méthode pour afficher les détails d'une maladie
  openDetailsModal(maladie: Maladie): void {
    if (maladie) {
      this.selectedMaladie = maladie;  // Objet maladie valide
    }
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMaladie = { id: 0, nom: '', informations: '', symptomes: '', causes: '' };
  }

  // Méthodes pour gérer la suppression
  showDeleteModal(maladie: Maladie): void {
    this.selectedMaladie = maladie;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
    this.selectedMaladie = { id: 0, nom: '', informations: '', symptomes: '', causes: '' };
  }
}
