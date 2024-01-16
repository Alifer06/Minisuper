import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {
  private encargado: any;

  constructor() { }

  //Esta funcion sera llamda, y se le pasará el arreglo con los datos del enacargado.
  setEncargado( data:any ) {
    //Es importante ponerlo en la posición 0.
    this.encargado = data[0];
    console.log(this.encargado);
  }

  //Función que será llamda, y retornara al encragado.
  getEncargado() {
    return this.encargado;
  }
}
