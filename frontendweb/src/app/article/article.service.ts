import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://localhost:8082/api/articles'; // URL de votre API Spring Boot
  private apiPlantes ='http://localhost:8082/api/plantes';
  constructor(private http: HttpClient) {}

  // Méthode pour récupérer toutes les plates
  getPlantes(): Observable<any[]> {
    const token = localStorage.getItem('auth_token'); // Récupération du token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les headers
    });

    return this.http.get<any[]>(this.apiPlantes, { headers });
  }

  // Récupérer tous les articles
  getArticles(): Observable<any[]> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Supprimer un article par son ID
  deleteArticle(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
   // Ajouter un nouvel article
   addArticle(articleData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(this.apiUrl, articleData, { headers });
  }

  // Mettre à jour un article existant
  updateArticle(id: number, articleData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupération du token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les headers
    });

    return this.http.put<any>(`${this.apiUrl}/${id}`, articleData, { headers });
  }

  // Récupérer tous les articles associés à une plante
getArticlesByPlant(plantId: number): Observable<any[]> {
  const token = localStorage.getItem('auth_token'); // Récupération du token
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`, // Ajout du token dans les headers
  });

  // Appeler l'API avec l'ID de la plante
  return this.http.get<any[]>(`${this.apiUrl}/filterByPlante/${plantId}`, { headers });
}



}

