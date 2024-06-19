import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import axios from 'axios';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent {
    correo: string = '';
    nombres: string = '';
    telefono: string = '';

    constructor(public dialogRef: MatDialogRef<DialogoComponent>) {}

    aceptarClick() {
      const correoInput = document.getElementById('correo') as HTMLInputElement;
      const nombresInput = document.getElementById('nombres') as HTMLInputElement;
      const dniInput = document.getElementById('dni') as HTMLInputElement;

      const nombre = nombresInput.value.toString().trim();
      const correo = correoInput.value.toString().trim();
      const DNI = dniInput.value.toString().trim();
      console.log(nombre,correo,DNI);

      axios.post('https://backend-nine-amber-97.vercel.app/enviar-mail', {nombre,correo,DNI}, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then(response => {
              console.log('Respuesta del servidor:', response.data);
              alert('Correo enviado exitosamente');
              this.dialogRef.close(); // Cerrar el diálogo solo después de un envío exitoso
          })
          .catch(error => {
              console.error('Error al enviar el correo:', error);
              alert('Error al enviar el correo');
          });
  }
}
