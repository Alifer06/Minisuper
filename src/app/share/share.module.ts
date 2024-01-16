import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { FooterTotalComponent } from './components/footer-total/footer-total.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { HeaderBackComponent } from './components/header-back/header-back.component';



@NgModule({
  declarations: [
    CustomInputComponent,
    HeaderBackComponent,
    FooterTotalComponent,
    MenuBarComponent
  ],
  exports: [
    CustomInputComponent,
    HeaderBackComponent,
    
    FooterTotalComponent,
    MenuBarComponent,
    ReactiveFormsModule,  
    FormsModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ShareModule { }
