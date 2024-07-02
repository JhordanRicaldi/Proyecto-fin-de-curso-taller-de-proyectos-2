import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CitaService } from '../../services/cita.service';
import { OdontogramaService } from '../../services/odontograma.service';
import { ModalUIComponent } from '../ui/modal/modal.component';
import { DialogoComponent } from '../ui/dialogo/dialogo.component';

import { format, differenceInYears, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import axios from 'axios';

@Component({
  selector: 'app-odontograma',
  templateUrl: './odontograma.component.html',
  styleUrls: ['./odontograma.component.css'],
})
export class OdontogramaComponent implements OnInit {
  isLoading: boolean;
  paciente: any;
  usuario: any;
  cita: any;
  edadCategoria: string = '';
  tipoOdontograma: string;
  fechaActual = new Date();
  odontograma: any;
  form: FormGroup;
  public saveButtonPressed = false;
  formInvalid: boolean = false;
  @ViewChild('modal') modal!: ModalUIComponent;

  formatDate(date: Date | string): string {
    let validDate: Date;

    if (typeof date === 'string') {
      const [day, month, year] = date.split('/');
      validDate = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      validDate = date;
    }

    return validDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  constructor(
    private citaService: CitaService,
    private odontogramaService: OdontogramaService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading = true;
    this.tipoOdontograma = 'geometrico';
    this.odontograma = [];
    this.form = this.fb.group({});
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const dni = params.get('dni');
        if (dni) {
          this.citaService.getPacienteYUsuarioByDNI(dni).subscribe({
            next: (resultado) => {
              if (resultado && resultado.paciente && resultado.usuario) {
                this.paciente = resultado.paciente;
                this.usuario = resultado.usuario;
                this.cita = resultado;
                const edad = this.calcularEdad(this.paciente.FechaNacimiento);
                this.edadCategoria = edad > 12 ? 'adulto' : 'menor';
                this.isLoading = false;
              } else {
                console.error('No se encontró la cita para el DNI proporcionado.');
                this.isLoading = false;
              }
            },
            error: (error) => {
              console.error('Error al obtener datos del paciente y usuario:', error);
              this.isLoading = false;
            },
          });
        } else {
          console.error('No se recibió DNI en la ruta.');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener parámetros de la ruta:', error);
        this.isLoading = false;
      },
    });

    this.initializeForm();

    this.odontogramaService.currentOdontograma.subscribe((odontograma) => {
      this.odontograma = odontograma;
      if (!this.form.controls['odontograma']) {
        this.form.addControl(
          'odontograma',
          this.fb.control(
            Object.keys(this.odontograma).length > 0,
            Validators.requiredTrue
          )
        );
      } else {
        this.form.controls['odontograma'].setValue(
          Object.keys(this.odontograma).length > 0,
          { emitEvent: false }
        );
      }
    });
  }

  formatearFecha(fecha: string, incluirHora: boolean = false): string {
    const formato = incluirHora ? 'dd/MM/yyyy HH:mm:ss a' : 'dd/MM/yyyy';
    return format(parseISO(fecha), formato, { locale: es });
  }

  calcularEdad(fechaNacimiento: string): number {
    return differenceInYears(new Date(), parseISO(fechaNacimiento));
  }

  initializeForm() {
    this.form = this.fb.group({
      especificaciones: ['', [Validators.required, Validators.maxLength(500)]],
      observaciones: ['', [Validators.required, Validators.maxLength(500)]],
      odontograma: [
        Object.keys(this.odontograma).length > 0,
        Validators.requiredTrue
      ],
    });
  }

  isFormValid() {
    if (this.form.valid) {
      return true;
    } else {
      console.warn('El formulario no es válido');
      return false;
    }
  }

  async openConfirmationModal() {
    this.form.markAllAsTouched();

    if (!this.isFormValid()) {
      return;
    }

    const numDientes = Object.keys(this.odontograma).length;
    const dientesTexto = numDientes > 1 ? 'dientes' : 'diente';
    const pacienteNombre = this.paciente.Nombre;

    try {
      const result = await this.modal.open(
        'Confirmar Guardado de Odontograma',
        `¿Estás seguro de que quieres guardar este odontograma de ${pacienteNombre}? Has marcado ${numDientes} ${dientesTexto}.`,
        'confirm'
      );

      if (!result) {
        return;
      }

      this.isLoading = true;
      this.onSave();
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSave() {
    if (this.isFormValid()) {
      this.isLoading = true;
      const odontograma = {
        especificaciones: this.form.controls['especificaciones'].value,
        observaciones: this.form.controls['observaciones'].value,
        tipoOdontograma: this.tipoOdontograma,
        edadCategoria: this.edadCategoria,
        fecha: this.fechaActual,
        odontograma: this.odontograma,
        operador: {
          codigo: this.usuario.codigo,
          nombre: this.usuario.nombre,
          apellido: this.usuario.apellido,
          email: this.usuario.email,
          telefono: this.usuario.phone,          
        },        
      };

      const paciente = {
        dni: this.paciente.dni,
        nombres: this.paciente.Nombre,
        apellidoP: this.paciente.ApellidoPaterno,
        apellidoM: this.paciente.ApellidoMaterno,
        fechaNac: this.paciente.FechaNacimiento,
        fechaRegistro: this.paciente.FechaCreacion,
        sexo: this.paciente.Sexo,
        lugar: this.paciente.Lugar,
        domicilio: this.paciente.Domicilio,
        estadoCivil: this.paciente.EstadoCivil,
        telefono: this.paciente.NroCelular,
        email: this.paciente.Correo,
        ocupacion: this.paciente.Ocupacion,
        responsable: this.paciente.Responsable,
        domicilioResponsable: this.paciente.DomicilioResponsable,
        telefonoResponsable: this.paciente.CelularResponsable,
        motivoConsulta: this.cita.MotivoConsulta,
        odontogramas: [odontograma],
      };

      const pacienteJSON = JSON.stringify(paciente);

      axios
        .post('https://backend-nine-amber-97.vercel.app/pacientes', pacienteJSON, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          this.isLoading = false;
          this.modal.open(
            'Odontograma Guardado Exitosamente',
            'El odontograma de' +
            paciente.nombres +
            ' ha sido guardado con éxito.',
            'success'
          );
          this.modal.onClose.subscribe(() => {
            this.router.navigate(['/pacientes']);
          });
        })
        .catch((error) => {
          this.isLoading = false;
          this.modal.open(
            'Error al Guardar Odontograma',
            'Hubo un error al guardar el odontograma de ' +
            paciente.nombres +
            '. Por favor, inténtalo de nuevo. ' +
            error.code,
            'error'
          );
          console.error('Error al guardar odontograma:', error);
        });
    }
  }

  descargarPDF() {
    const dialogRef = this.dialog.open(DialogoComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.info('El diálogo se cerró');
    });
  }
}
