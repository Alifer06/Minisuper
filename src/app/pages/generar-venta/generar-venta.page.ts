import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
//Se importa el servicio a usar Producto y la intefaz.
import { ProductoService, Producto } from '../../services/producto.service'

//Importar el plugin de capacitor para poder guardar el pdf en el telefono.
import { Filesystem, Directory } from '@capacitor/filesystem';

//Implemenatr los toast controller.
import { ToastController } from '@ionic/angular';

//Importar notificacion
import { LocalNotifications } from '@capacitor/local-notifications';

//Importar el servicio de EncargadoService

import { EncargadoService } from '../../services/encargado.service';

//Importar la libreria de jspdf
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


interface ProductoSeleccionado {
  id_producto: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  total: number;
}

@Component({
  selector: 'app-generar-venta',
  templateUrl: './generar-venta.page.html',
  styleUrls: ['./generar-venta.page.scss'],
})
export class GenerarVentaPage implements OnDestroy {
  //Variable que maneja el total de toda la venta.
  total$!: number



  //Objeto de tipo producto.

  productos!: Producto[];

  //Este arreglo almacena cada respuesta, y es que se mostraá en la lista.

  productosLista2: Producto[] = [];


  productosLista: ProductoSeleccionado[] = [];

  


  //Codigo que 
  codigo: any;
  cantidad = 1;
  scannedResult: any;
  content_visibility = '';
  cancel_button = false;
  producto: any;

  constructor(private service: ProductoService,
    private encargadoService: EncargadoService,
    private toastController: ToastController, //implemetar el toast
  ) { }

  ngOnInit() { }



  //Funcion para generar la venta.
  generarVenta() {

    let encargado: any;
    let nombreEncargado: any;

    this.service.getTotal().subscribe(total => {
      this.TotaltoTicket(total);
    });

    encargado = this.encargadoService.getEncargado();
    nombreEncargado = encargado.nombre;

     // Calcula la altura necesaria para el PDF
     const baseHeight = 60; // Espacio para encabezados, totales, etc.
     const productHeight = 10; // Espacio por producto
     const totalHeight = baseHeight + (this.productosLista.length * productHeight);
  


    let yPosition = 45; // Asegúrate de que esta línea exista antes de usar yPosition por primera vez
    // Configura jsPDF para un ancho de papel de 80 mm, que es común para impresoras térmicas
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [80, totalHeight] // Asumiendo un ticket de longitud 150mm. Ajusta según sea necesario.
    });

    // Configuración de la fuente
    doc.setFontSize(10); // Ajusta el tamaño de la fuente según sea necesario

    // Datos de la venta
    const saleData = {
      title: 'TICKET DE VENTA',
      clientName: 'Público en general',
      saleNumber: '123456789',
      Encargado: nombreEncargado,
      products: this.productosLista, // Asumiendo que esto es un array de objetos de productos
      totalGlobal: this.total$
    };

    // Alinear el título y los datos de venta al centro y agregarlos al documento
    doc.text(saleData.title, 40, 10, { align: 'center' });
    doc.text(`Cliente: ${saleData.clientName}`, 40, 15, { align: 'center' });
    doc.text(`Atendido por: ${saleData.Encargado} `, 40, 20, { align: 'center' }  );
    doc.text(`Número de venta: ${saleData.saleNumber}`, 40, 25, { align: 'center' });

    // ...

    // Asumiendo que productosLista es un array, iteramos sobre él para agregar los productos al ticket
    // Inicio de la posición Y para los productos
    doc.text(' Cantidad   Precio Unitario     Subtotal', 10, 35);


    saleData.products.forEach(product => {
      doc.text('-----------------------------------------------------', 11, yPosition + 7);
      doc.text(product.nombre, 10, yPosition);
      doc.text(`    ${product.cantidad}                     ${product.precio}                  ${product.total}`, 10, yPosition + 5);
      yPosition += 10; // Incrementa la posición Y para el siguiente producto
    });



    doc.text(`Total: ${saleData.totalGlobal}`, 45, yPosition);



    // Añadir un mensaje de agradecimiento al final del ticket
    doc.text('Gracias por su compra', 40, yPosition + 10, { align: 'center' });


    /* Codigo que se añade para poder guardar el PDF en el telefono. */
    // Guardar el documento PDF como un ticket
    // Convertir el contenido del PDF a Base64
    const pdfOutput = doc.output('datauristring');

    // Extraer solo la parte de Base64 de la cadena
    const base64Content = pdfOutput.split(',')[1];

    // Guardar el PDF en el dispositivo
    this.guardarPDFEnDispositivo(base64Content, 'ticket-venta.pdf');
  }

  //Función pque crea la notifcacion.
  async mostrarNotificacion(mensaje: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Confirmación",
          body: mensaje,
          id: 1,
          sound: '', // Puedes especificar un sonido si lo deseas
          extra: null
        }
      ]
    });
  }



  //Funcion para guardar el pdf en el dispositivo.
  async guardarPDFEnDispositivo(pdfBase64: string, fileName: string) {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: pdfBase64,
        directory: Directory.Documents, // O el directorio adecuado
        recursive: true
      });
      console.log('Archivo guardado:', result.uri);

      // Mostrar un toast de éxito
      this.mostrarToast('Archivo PDF guardado con éxito', 'primary');
      //Enviar notificación.
      this.mostrarNotificacion('Archivo PDF guardado con éxito');
    } catch (e) {
      console.error('Error al guardar el archivo:', e);

      // Mostrar un toast de error
      this.mostrarToast('Error al guardar el archivo PDF', 'danger');
    }
  }

  //Funcion del toast.
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 2000 // Duración en milisegundos
    });
    toast.present();
  }

  //Funcion que actualizara el tiket.
  TotaltoTicket(total: number) {
    this.total$ = total;
  }

  //Función para quitar productos de la lista.
  quitarProducto(id: string) {
    this.productosLista = this.productosLista.filter(producto => producto.id_producto !== id);

    this.service.actualizarProductosSeleccionados(this.productosLista);


    return console.log(this.productosLista);
  }

  //Función que agrega productos.
  agregarProducto() {

    var codigo2 = "";
    var cantidad2 = 1;
    codigo2 = this.codigo;
    cantidad2 = this.cantidad;

    this.service.get(codigo2).subscribe(response => {
      console.log(response);
      this.productos = response;

      for (const producto of response) {
        this.productosLista2.push(producto);
      }

    })
  }

  //Funcion para actualizar la cantidad el prodcuto.
  actualizarTotal(producto: ProductoSeleccionado) {
    producto.total = producto.cantidad * producto.precio;

    //Se subsicribe para actualizar el total, llama a la funcion del servicio.
    this.service.actualizarProductosSeleccionados(this.productosLista);

    //Llamar la funcion para habilitar o deshabilitar el boton
  }

  //Funcion para añadir producto a la lista de los productos
  agregarLista() {

    const codigo2 = this.scannedResult;

    this.service.get(codigo2).subscribe((response) => {
      for (const producto of response) {
        //Se debe adaptar los atributos al formato de productosSeleccionados[]
        const productoSeleccionado: ProductoSeleccionado = {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          codigo: producto.codigo_producto,
          descripcion: producto.descripcion,
          precio: parseFloat(producto.precio),
          cantidad: 1,
          total: parseFloat(producto.precio)
        };

        const productoExistente = this.productosLista.find(
          (p) => p.codigo === productoSeleccionado.codigo
        );

        if (productoExistente) {
          productoExistente.cantidad++;
          productoExistente.total = productoExistente.cantidad * productoExistente.precio;


        } else {
          this.productosLista.push(productoSeleccionado);
        }


      }
      console.log(this.productosLista);
      this.service.actualizarProductosSeleccionados(this.productosLista);

    });

    

  }


  // Codigo del Scanner
  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      } else {
        // No se ha otorgado el permiso
        return false;
      }
    } catch (e) {
      console.error(e);
      return false; // Manejo de errores, devuelve false en caso de error
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();

      const bodyElement = document.querySelector('body');
      if (bodyElement) {
        bodyElement.classList.add('scanner-active');
      } else {
        console.error('No se encontró el elemento "body"');
      }

      this.content_visibility = 'hidden';
      this.cancel_button = true;
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();

      if (bodyElement) {
        bodyElement.classList.remove('scanner-active');
      }
      this.cancel_button = false;
      this.content_visibility = '';
      if (result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch (e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();

    const bodyElement = document.querySelector('body');
    if (bodyElement) {
      bodyElement.classList.remove('scanner-active');
    } else {
      console.error('No se encontró el elemento "body"');
    }

    this.content_visibility = '';
    this.cancel_button = false;
  }

  productosSeleccionados !: ProductoSeleccionado[];



  ngOnDestroy(): void {
    this.stopScan();
  }



}
