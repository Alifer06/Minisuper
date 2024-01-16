import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';

export interface Producto{
  id_producto:string;
  codigo_producto:string;
  nombre:string;
  descripcion:string;
  existencia:string;
  cantidad: string;
  precio:string; //esto agregue
  //imagen_producto:string;  esto lo quite
  id_categoria:string;
}

interface ProductoSeleccionado{
  id_producto:string;
  nombre: string;
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productosSeleccionadosSubject = new BehaviorSubject<ProductoSeleccionado[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);

  private url = 'http://192.168.3.21/api_minisuper/productos'
  constructor(private http: HttpClient) { }

  //Función que obtendrá el producto, según el codigo del mismo.
  get(codigo_producto: string){
    return this.http.get<[Producto]>(this.url + '/' + codigo_producto);
  }

  create(producto: Producto){
    return this.http.post(this.url, producto);
  }


  //Metodo para obtener el total de le venta.
  getTotal(){
    return this.totalSubject.asObservable();
  }

  //Metodo para actualizar la lista de productos seleccionados y el total.
  actualizarProductosSeleccionados(productos: ProductoSeleccionado[]) {
    this.productosSeleccionadosSubject.next(productos);
    this.calcularTotal();
  }

  // Método privado para calcular el total
  private calcularTotal() {
    const total = this.productosSeleccionadosSubject.getValue()
      .reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);
    this.totalSubject.next(total);
  }



}
