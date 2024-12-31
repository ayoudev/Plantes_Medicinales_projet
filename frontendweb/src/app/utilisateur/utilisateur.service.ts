import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from './utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8082/api/v1/auth/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Utilisateur[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Utilisateur[]>(this.apiUrl, { headers });
  }

  deleteUserById(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
