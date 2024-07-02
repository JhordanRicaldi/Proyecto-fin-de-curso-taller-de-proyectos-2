import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
import { ModalUIComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css'],
})
export class DialogoComponent {
  correo: string = '';
  nombres: string = '';
  telefono: string = '';
  isLoading: boolean = false;

  @ViewChild('modal') modal!: ModalUIComponent;

  constructor(public dialogRef: MatDialogRef<DialogoComponent>) {}

  aceptarClick() {
    this.isLoading = true;
    const correoInput = document.getElementById('correo') as HTMLInputElement;
    const nombresInput = document.getElementById('nombres') as HTMLInputElement;
    const dniInput = document.getElementById('dni') as HTMLInputElement;

    const nombre = nombresInput.value.toString().trim();
    const correo = correoInput.value.toString().trim();
    const DNI = dniInput.value.toString().trim();
    console.log(nombre, correo, DNI);

    axios
      .post(
        'https://5r1t37dq-3001.brs.devtunnels.ms/enviar-mail',
        { nombre, correo, DNI },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Respuesta del servidor:', response.data);
        this.isLoading = false;
        this.modal.open(
          'Correo Enviado',
          'Correo enviado exitosamente a ' + correo + '.',
          'success'
        );
        this.modal.onClose.subscribe(() => {
          this.dialogRef.close();
        });
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        this.isLoading = false;
        this.modal.open(
          'Error al Enviar Correo',
          'Error al enviar el correo. Por favor, inténtalo de nuevo. ' +
            error.name,
          'error'
        );
      });
  }
}
