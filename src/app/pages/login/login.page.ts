import { Component, Directive, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';

import { Router } from '@angular/router';  // Importa el Router

import { LoadingController, ToastController } from '@ionic/angular';
  
//importar la el servicio de login
import { LoginService } from '../../services/login.service';

//Importar el servicio de encargado
import { EncargadoService } from '../../services/encargado.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //Interfaz de los datos que se pediran.
  data = {
    username: '',
    password: ''
  }
  
  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  constructor(

    //Injectar el servicio de login
    private loadingController: LoadingController,
    private loginService: LoginService,
    private router: Router,  // Inyectar el Router
    private encargadoService: EncargadoService,
    private toastController: ToastController

  ) { }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario o contraseña incorrecto',
      duration: 2000,
      position: 'middle',
      cssClass: 'my-custom-toast',
      color: 'danger'
    });
    toast.present();
  }
  
  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Has iniciado sesión, bienvenido',
      duration: 2000,
      position: 'middle',
      color: 'success' // Usa un color que indique éxito, como verde
    });
    toast.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circular',
    });
    await loading.present();
  
    return loading;
  }
  //Fucion que al ser mandado los datos, se activa.
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.presentLoading().then(loading => {
      this.loginService.login(form.value.username, form.value.password)
        .subscribe(response => {
          setTimeout(() => { // Añadir un retardo antes de cerrar el loading
            loading.dismiss();
            if (response.status === 'success') {
              this.presentSuccessToast();
              this.encargadoService.setEncargado(response.encargado);
              this.router.navigate(['/opciones-venta']);
            } else {
              this.presentToast();
              console.error(response.message);
            }
          }, 2000);
        }, error => {
          loading.dismiss(); // Asegúrate de cerrar el loading si hay un error
          console.error(error);
          // Considera mostrar un mensaje diferente si es un error de red
        });
    });
    }
  }
  
}


