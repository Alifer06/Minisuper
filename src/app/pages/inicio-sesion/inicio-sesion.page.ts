import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, Usuario } from 'src/app/services/login.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage implements OnInit {
  @Input() usuario!: Usuario;

  ngOnInit() {}
    
  

  constructor(private serviceLogin: LoginService,
              private router: Router) { }

  //Formulario de login
}
