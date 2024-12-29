import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Plante } from './user-home.model';
@Injectable({
  providedIn: 'root',
})
export class PlanteService {
  private apiUrl = 'http://localhost:8082/api/plantes'; // URL de votre backend

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
