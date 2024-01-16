import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, ModalController } from '@ionic/angular';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Producto, ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  @Input() producto!: Producto;

  constructor(private modalCtrl : ModalController,
              private service: ProductoService,
              private alertCtrl: AlertController,
              private serviceCategoria: CategoriaService) { }

  codigo: any;
  scannedResult: any;
  content_visibility = '';
  cancel_button = false;

  ngOnInit() {
    this.serviceCategoria.get().subscribe(data => {
      this.categorias = data;
    })
  }
  
  onSubmit(form : NgForm){
    const producto = form.value;
    console.log(form.value);
    this.service.create(producto).subscribe(response => {
      this.modalCtrl.dismiss(response, 'creado');
    });
  }

  categorias: any[] = [];

  

  selectedItem!: string;
  cerrarModal(){
    this.alertCtrl.create({
      header: 'Cerrar',
      message: '¿Estas seguro que deseas salir?',
      buttons:[
        {
          text: 'Si',
          handler:() =>    {
            this.modalCtrl.dismiss();
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alertEl => alertEl.present());
   
  }

  //INICIA EL ESCANER

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
    console.log('estamos empezando')
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
      this.cancel_button=true;
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      
      if (bodyElement) {
        bodyElement.classList.remove('scanner-active');
      }
      this.cancel_button=false;
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
   
  ngOnDestroy(): void {
    this.stopScan();
 }
}
