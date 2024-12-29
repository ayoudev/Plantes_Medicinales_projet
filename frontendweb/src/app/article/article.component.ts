import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticleService } from './article.service';  // Assurez-vous d'importer le service

interface Plante {
  id: number;
  nom: string;
}

interface Article {
  id: number;
  titre: string;
  contenu: string;
  plante: Plante;
  image: string;
}

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],

})
export class ArticleComponent {
  OCPLogo = 'assets/images/logo.png';
  avatar = 'assets/images/pro.png';
  deco = 'assets/images/lavande.jpg';
  showDropdown: boolean = false;
  showAddModal: boolean = false;  // For Add Modal
  showUpdateModal = false;
  showDeleteConfirmModal: boolean = false;  // For Delete Confirmation Modal
  currentArticleId: number = 0;
  showCommentModal: boolean = false;
  searchQuery: string = '';
  filteredArticles: Article[] = [];

  articles: Article[] = [];


  newArticle: Article = {
    id: 0,
    titre: '',
    contenu: '',
    image: '',
    plante: { id: 0, nom: '' },
  };

  selectedArticle: Article = {
    id: 0,
    titre: '',
    contenu: '',
    image: '',
    plante: { id: 0, nom: '' },
  };
  plantes: Plante[] = [];
  constructor(private router: Router, private articleService: ArticleService) {}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }


  openUpdateModal(article: Article): void {
    this.currentArticleId = article.id;
    this.showUpdateModal = true;
  }

  openDeleteModal(articleId: number): void {
    this.currentArticleId = articleId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
    this.currentArticleId = 0;
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page

    const planteId = this.selectedArticle.plante?.id;
   console.log(planteId);
    if (planteId == 0) {
      // Si "All" est sélectionné, récupérez tous les articles
      this.articleService.getArticles().subscribe(
        (data) => {
          this.filteredArticles = data; // Affiche tous les articles
        },
        (error) => {
          Swal.fire('Erreur', 'Impossible de récupérer tous les articles.', 'error');
        }
      );
    } else if (planteId) {
      // Si une plante spécifique est sélectionnée, filtrez par ID
      this.articleService.getArticlesByPlant(planteId).subscribe(
        (data) => {
          this.filteredArticles = data; // Met à jour les articles affichés
        },
        (error) => {
          Swal.fire('Erreur', 'Impossible de récupérer les articles pour cette plante.', 'error');
        }
      );
    } else {
      // Si aucune plante n'est sélectionnée
      Swal.fire('Erreur', 'Veuillez sélectionner une plante pour la recherche.', 'warning');
    }
  }



  ngOnInit(): void {
    this.getArticles();  // Charger les articles dès que le composant est initialisé
    this.getPlantes();
  }
  getPlantes(): void {
    this.articleService.getPlantes().subscribe(
      (data) => {
        this.plantes = data; // Assigner les plantes récupérées à la variable
        console.log('Plantes récupérées:', this.plantes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des plantes:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des plantes.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }



  getArticles(): void {
    this.articleService.getArticles().subscribe(
      (data) => {
        this.articles = data;
        this.filteredArticles = data;  // Initialiser les articles filtrés
        console.log('Articles récupérés:', this.articles);
      },
      (error) => {
        console.error('Erreur lors de la récupération des articles:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des données.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  // Méthode de filtrage
  filterArticles() {
    this.filteredArticles = this.articles.filter(article =>
      article.plante.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  addArticle(): void {
    console.log(this.newArticle.plante.id);
    if (this.newArticle.titre && this.newArticle.contenu && this.newArticle.plante.id > 0 ) {
      const formData = new FormData();
      formData.append('titre', this.newArticle.titre);
      formData.append('contenu', this.newArticle.contenu);
      formData.append('planteId', this.newArticle.plante.id.toString());  // Pour envoyer l'objet plante
      const imageInput: HTMLInputElement = document.getElementById('images') as HTMLInputElement;
      if (imageInput.files && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }

      this.articleService.addArticle(formData).subscribe(
        (data) => {
          this.articles.push(data);
          this.filteredArticles = this.articles;
          Swal.fire({
            title: 'Succès',
            text: 'L\'article a été ajouté avec succès.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.closeAddModal();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'article:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout de l\'article.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }



  // Fermer le modal de mise à jour
  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedArticle  = {
      id: 0,
      titre: '',
      contenu: '',
      image: '',
      plante: { id: 0, nom: '' },
    };
  }
  // Méthode de suppression d'article
  deleteArticle(): void {
    const index = this.articles.findIndex(a => a.id === this.currentArticleId);
    if (index !== -1) {
      this.articles.splice(index, 1);
      this.filteredArticles = this.articles;
      Swal.fire({
        icon: 'success',
        title: 'Article supprimé avec succès.',
        showConfirmButton: false,
        timer: 1500,
      });
      this.closeDeleteModal();
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'L\'article n\'a pas été trouvé pour la suppression.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }



  updateArticle(): void {
    // Validation des champs obligatoires
    if (!this.selectedArticle.titre || !this.selectedArticle.contenu || !this.selectedArticle.plante?.id) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();

    // Ajout des données dans FormData
    formData.append('titre', this.selectedArticle.titre);
    formData.append('contenu', this.selectedArticle.contenu);
    formData.append('planteId', this.selectedArticle.plante.id.toString());

    // Gestion de l'image
     const imageInput: HTMLInputElement = document.getElementById('images') as HTMLInputElement;
      if (imageInput.files && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }

    // Appel au service pour mettre à jour l'article
    this.articleService.updateArticle(this.selectedArticle.id, formData).subscribe(
      (updatedArticle) => {
        // Mise à jour de l'article localement
        const index = this.articles.findIndex(article => article.id === updatedArticle.id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
          this.filteredArticles = [...this.articles];
        }
        Swal.fire({
          title: 'Succès',
          text: 'L\'article a été mis à jour avec succès.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.closeUpdateModal();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'article :', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour de l\'article. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }






  openCommentModal(article: Article): void {
    this.selectedArticle = article;
    this.showCommentModal = true;
  }

  // Fermer le modal de commentaires
  closeCommentModal(): void {
    this.showCommentModal = false;
  }




}
