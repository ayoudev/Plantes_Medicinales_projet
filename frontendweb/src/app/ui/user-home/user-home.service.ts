import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plante } from './user-home.model'; // Import du modèle Plante

@Injectable({
  providedIn: 'root'
})
export class PlanteService {
  private apiUrl = 'http://localhost:8082/api/plantes'; // Base URL pour les plantes
  private categorieApiUrl = 'http://localhost:8082/api/categories'; // Base URL pour les catégories

  constructor(private http: HttpClient) {}


  // Méthode pour récupérer toutes les plantes
  getAllPlantes(): Observable<Plante[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Plante[]>(this.apiUrl, { headers });
  }


}
