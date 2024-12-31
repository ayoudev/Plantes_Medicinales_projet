import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ArticleService } from './articl.service';  // Assurez-vous d'importer le service
import { Comment } from './articl.model';  // Assurez-vous que le modèle est bien importé

interface Plante {
  id: number;
  nom: string;
}

interface Article {
  id: number;
  titre: string;
  contenu: string;
  image: string;
  plante: Plante;
  commentaires: Commentaire[];
}
interface Commentaire {
  id?: number;
  auteur: string;
  contenu: string;
  LocalDate: string;
}



@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articl.component.html',
  styleUrls: ['./articl.component.css'],

})
export class ArticlComponent  implements AfterViewChecked {
  @ViewChild('commentsContainer') commentsContainer: any;

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

    // Déclencher le défilement au bas du modal
    ngAfterViewChecked(): void {
      if (this.showCommentModal && this.commentsContainer) {
        this.scrollToBottom();
      }
    }
  // Faire défiler vers le bas du modal
  scrollToBottom(): void {
    const container = this.commentsContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  newComment: Commentaire = {
    contenu: '',
    auteur: '',
    LocalDate: '',
  };
  currentUser: any = null; // Stocke les informations de l'utilisateur connecté

  newArticle: Article = {
    id: 0,
    titre: '',
    contenu: '',
    image: '',
    plante: { id: 0, nom: '' },
    commentaires: [] // Aucun commentaire par défaut
  };

  selectedArticle: Article = {
    id: 0,
    titre: '',
    contenu: '',
    image: '',
    plante: { id: 0, nom: '' },
    commentaires: [] // Aucun commentaire par défaut
  };
  plantes: Plante[] = [];
  constructor(private router: Router, private articleService: ArticleService) { }

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

  openDeleteModal(articleId: number): void {
    this.currentArticleId = articleId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
  }
  onSearchSubmit(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page

    const planteId = parseInt(this.searchQuery); // Convertir la recherche en nombre
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
    this.getAuthenticatedUser();
  }
   // Récupérer l'utilisateur connecté
   getAuthenticatedUser(): void {
    console.log('Utilisateur connecté:', this.currentUser);
    console.log(localStorage.getItem('auth_token'));

    const token = localStorage.getItem('auth_token'); // Remplacez par votre méthode pour obtenir le token
    if (token) {
      this.articleService.getAuthenticatedUser(token).subscribe({
        next: (user) => {
          this.newComment.auteur = `${user.firstname} ${user.lastname}`;
          console.log('Utilisateur connecté:', `${user.firstname} ${user.lastname}`);
        },
        error: () => {
          Swal.fire('Erreur', 'Impossible de récupérer les informations utilisateur', 'error');
        },
      }); 
    }
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

  openCommentModal(article: Article): void {
    this.selectedArticle = article;
    console.log('Article sélectionné:', this.selectedArticle);
    
    this.articleService.getCommentsByArticle(article.id).subscribe({
      next: (commentaires) => {
        console.log('Commentaires récupérés:', commentaires);
        this.selectedArticle.commentaires = commentaires; // Associer les commentaires récupérés
        this.showCommentModal = true; // Ouvrir le modal
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des commentaires :', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de récupérer les commentaires pour cet article.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
    
  }
  
  // Fermer le modal de commentaires
  closeCommentModal(): void {
    this.showCommentModal = false;
  }

 // Ajouter un commentaire
addComment(): void {
  if (!this.newComment.contenu || !this.selectedArticle) {
    Swal.fire('Erreur', 'Veuillez écrire un commentaire avant de soumettre.', 'warning');
    return;
  }

  this.articleService.addComment(this.selectedArticle.id, this.newComment).subscribe({
    next: (comment) => {
      const newCommentaire: Commentaire = {
        id: comment.id,
        auteur: comment.auteur,
        contenu: comment.contenu,
        LocalDate: new Date().toISOString() // Ajout de la date actuelle ou une date adaptée
      };

      this.selectedArticle!.commentaires.push(newCommentaire);
        // Vider la case de commentaire après ajout
      this.newComment.contenu = ''; // Réinitialiser le champ du commentaire
      this.closeCommentModal();
      Swal.fire('Succès', 'Le commentaire a été ajouté avec succès.', 'success');
    },
    error: () => {
      Swal.fire('Erreur', 'Impossible d’ajouter le commentaire.', 'error');
    },
  });
}
}
