import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatDialogModule } from '@angular/material/dialog';

import { DialogoComponent } from './dialogo.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule // Importa FormsModule aquí
  ],
  declarations: [DialogoComponent],
  exports: [DialogoComponent],
})
export class DialogoModule {}
