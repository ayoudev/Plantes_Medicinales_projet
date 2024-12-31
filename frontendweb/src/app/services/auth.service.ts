// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/v1/auth/authenticate'; // Backend URL

  constructor(private http: HttpClient) {}

  authenticate(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, { email, password });
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
}
