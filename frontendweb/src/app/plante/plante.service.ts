import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plante } from './plante.model'; // Import du modèle Plante

@Injectable({
  providedIn: 'root'
})
export class PlanteService {
  private apiUrl = 'http://localhost:8082/api/plantes'; // Base URL pour les plantes
  private categorieApiUrl = 'http://localhost:8082/api/categories'; // Base URL pour les catégories

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une plante
  addPlante(planteData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupération du token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les headers
    });

    return this.http.post(`${this.apiUrl}/add`, planteData, { headers });
  }
  // Méthode pour récupérer toutes les plantes
  getAllPlantes(): Observable<Plante[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Plante[]>(this.apiUrl, { headers });
  }

  // Méthode pour récupérer toutes les catégories
  getCategories(): Observable<any[]> {
    const token = localStorage.getItem('auth_token'); // Récupération du token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les headers
    });

    return this.http.get<any[]>(this.categorieApiUrl, { headers });
  }
  // Méthode pour récupérer toutes les maladies
getMaladies(): Observable<any[]> {
  const token = localStorage.getItem('auth_token'); // Récupération du token
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`, // Ajout du token dans les headers
  });

  return this.http.get<any[]>('http://localhost:8082/api/maladies', { headers });
}
// Méthode pour filtrer les plantes par maladie
filterPlantesByMaladie(maladie: string): Observable<Plante[]> {
  const token = localStorage.getItem('auth_token'); // Récupération du token
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`, // Ajout du token dans les headers
  });

  return this.http.get<Plante[]>(`${this.apiUrl}/maladie?maladie=${encodeURIComponent(maladie)}`, { headers });
}


}
