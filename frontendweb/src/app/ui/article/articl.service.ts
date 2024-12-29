import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Assurez-vous d'importer l'opérateur map de rxjs/operators
import { Comment } from './articl.model';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    private apiUrl = 'http://localhost:9192/api/articles'; // URL de votre API Spring Boot
    private apiPlantes = 'http://localhost:9192/api/plantes';
    private apicommentairesUrl = 'http://localhost:9192/api/commentaires/article';
    constructor(private http: HttpClient) { }

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


    // Récupérer tous les articles associés à une plante
    getArticlesByPlant(plantId: number): Observable<any[]> {
        const token = localStorage.getItem('auth_token'); // Récupération du token
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`, // Ajout du token dans les headers
        });

        // Appeler l'API avec l'ID de la plante
        return this.http.get<any[]>(`${this.apiUrl}/filterByPlante/${plantId}`, { headers });
    }

    // Récupérer les commentaires associés à un article
    getCommentsByArticle(articleId: number): Observable<any[]> {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this.http.get<any[]>(`${this.apicommentairesUrl}/${articleId}`, { headers }).pipe(
            map((comments) =>
                comments.map((comment) => {
                    if (comment.datePublication) {
                        const [year, month, day, hour, minute] = comment.datePublication;
                        comment.LocalDate = new Date(year, month - 1, day, hour, minute);
                    }
                    return comment;
                })
            )
        );
    }


    ///////////////////
    private apiUrlAuthenticatedUser = 'http://localhost:9192/api/v1/auth/me';

    getAuthenticatedUser(token: string): Observable<any> {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(this.apiUrlAuthenticatedUser, { headers });
      }
////////////////////////

private apiAddCommentUrl = 'http://localhost:9192/api/commentaires/article';

addComment(articleId: number, comment: Comment): Observable<Comment> {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post<Comment>(`${this.apiAddCommentUrl}/${articleId}`, comment, { headers });
}


}
