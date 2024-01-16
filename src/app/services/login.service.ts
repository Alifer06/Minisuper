import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';


export interface Usuario{
  id_usuario: string;
  correo_electronico: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  // Url de la api que manejara el inicio de sesion.
  private apiUrl = 'http://192.168.3.21/api_minisuper/login'
  token2 !: string;
  

  constructor(
    //Se injecta el objeto, que podremos usar para manejar las peticiones. 
    private http: HttpClient,
    private router: Router
    
    ) { }

    //Inicio de sesion.
    login(correo_electronico: string, contrasena: string) {
      return this.http.post<any>(this.apiUrl, {correo_electronico, contrasena}).pipe(
        tap(response => {
          if (response.status === 'success') {
            localStorage.setItem('token', response.token);
          }
        })
      );
    }

    //Obtener el token
    getToken() {
      return localStorage.getItem('token');
    }

    //Verificar que este en logeo
    isLoggedIn() {
      const token = this.getToken();
      // Aquí deberías tener lógica para decodificar el token y verificar la expiración
      // Por ahora, simplemente comprobaremos si el token está presente
      return !!token; // Esto devolverá true si el token existe o false si no
    }
  
    logout() {
      localStorage.removeItem('token');
      // Redirige al usuario al login tras cerrar sesión
      this.router.navigateByUrl('/login');
    }

}
