// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base apuntando a la carpeta de tu backend local
  private apiUrl = 'http://localhost/ProyectoFinal'; 
  private currentUser: any = null;

  constructor(private http: HttpClient) {}
  
  /**
   * Registra un usuario enviando los datos a register.php
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register.php`, userData);
  }

  /**
   * Inicia sesión enviando las credenciales a login.php
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, credentials).pipe(
      tap((response: any) => {
        if (response && response.success) {
          this.currentUser = response.user;
          localStorage.setItem('user_session', JSON.stringify(response.user));
        }
      })
    );
  }

  /**
   * AGREGA ESTE MÉTODO: Envía el correo para iniciar el proceso de recuperación
   */
  recuperarClave(data: { correo: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recuperar.php`, data);
  }

  /**
   * Recupera los datos del usuario logueado
   */
  getUser() {
    if (!this.currentUser) {
      const savedSession = localStorage.getItem('user_session');
      this.currentUser = savedSession ? JSON.parse(savedSession) : null;
    }
    return this.currentUser;
  }

  /**
   * Cierra la sesión
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('user_session');
  }
}