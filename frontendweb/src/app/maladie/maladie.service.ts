import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaladieService {
  private apiUrl = 'http://localhost:8082/api/maladies'; // URL de votre API Spring Boot

  constructor(private http: HttpClient) {}

  // Récupérer toutes les maladies
  getMaladies(): Observable<any[]> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
   // Supprimer une maladie
   deleteMaladie(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Ajouter une nouvelle maladie
  addMaladie(maladie: any): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.apiUrl, maladie, { headers });
  }

  // Mettre à jour une maladie existante
  updateMaladie(id: number, maladie: any): Observable<any> {
    const token = localStorage.getItem('auth_token'); // Récupérer le token depuis le localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/${id}`, maladie, { headers });
  }
}

