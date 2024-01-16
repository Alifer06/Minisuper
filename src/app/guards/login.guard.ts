import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

//Importar el servicio de LoginService
import { LoginService } from '../services/login.service'


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  //Se injectan los servicios
  constructor(private loginService: LoginService, private router: Router) {}

  //Función que valdará si dejar pasar o no.
  canActivate(): boolean {
    if (this.loginService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
