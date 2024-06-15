import { Component, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { HistoriaClinicaService } from '../../services/historiaClinica.service';
import { OdontogramaService } from '../../services/odontograma.service';
import { ModalUIComponent } from '../ui/modal/modal.component';
import {SpinnerComponent} from '../ui/spinner/spinner.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from '../ui/dialogo/dialogo.component';
import axios from 'axios';
import domToImage from 'dom-to-image';
@Component({
  selector: 'app-odontograma',
  templateUrl: './odontograma.component.html',
  styleUrls: ['./odontograma.component.css'],
})
export class OdontogramaComponent {
  isLoading: boolean;
  paciente: any;
  userAuth: any;
  edadCategoria: string = '';
  tipoOdontograma: string;
  fechaActual = new Date();
  odontograma: any;
  form: FormGroup;
  public saveButtonPressed = false;
  formInvalid: boolean = false;
  @ViewChild('modal') modal!: ModalUIComponent;
  resultadosBusqueda: any[] = [];
  search = '';

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
    private historiaClinicaService: HistoriaClinicaService,
    private odontogramaService: OdontogramaService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.tipoOdontograma = 'geometrico';
    this.isLoading = true;
    this.odontograma = [];
    this.form = this.fb.group({});
    this.initializeForm();
  }

  ngOnInit(): void {
    this.historiaClinicaService.getPacienteAleatorio().subscribe((paciente) => {
      this.paciente = paciente;
      this.edadCategoria = paciente.edad > 12 ? 'adulto' : 'menor';
      this.isLoading = false;
    });
    this.historiaClinicaService.getUserAuthAleatorio().subscribe((userAuth) => {
      this.userAuth = userAuth;
      this.isLoading = false;
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
    this.form.controls['search'].valueChanges.subscribe((query) => {
      if (query) {
        this.historiaClinicaService
          .buscarPaciente(query)
          .subscribe((resultados) => {
            this.resultadosBusqueda = resultados;
          });
      } else {
        this.resultadosBusqueda = [];
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      if (this.resultadosBusqueda.length > 0) {
        this.search = this.resultadosBusqueda[0].nombres;
        if (event.key === 'Enter') {
          this.onSelect(this.search);
        }
      }
    }
  }

  onSelect(paciente: any) {
    this.paciente = paciente;
    this.form.controls['search'].setValue(
      `${paciente.nombres} ${paciente.apellidos} (${paciente.dni})`
    );
  }

  initializeForm() {
    this.form = this.fb.group({
      especificaciones: ['', Validators.required],
      observaciones: ['', Validators.required],
      odontograma: [
        Object.keys(this.odontograma).length > 0,
        Validators.requiredTrue,
      ],
      search: [''],
    });
  }

  isFormValid() {
    if (this.form.valid) {
      return true;
    } else {
      console.log('El formulario no es válido');
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
    const pacienteNombre = this.paciente.nombres;

    try {
      const result = await this.modal.open(
        'Confirmar Guardado de Odontograma',
        `¿Estás seguro de que quieres guardar este odontograma de ${pacienteNombre}? Has marcado ${numDientes} ${dientesTexto}.`,
        'confirm'
      );

      if (!result) {
        return;
      }

      // Aquí se guarda el odontograma
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
      const odontograma = {
        especificaciones: this.form.controls['especificaciones'].value,
        observaciones: this.form.controls['observaciones'].value,
        tipoOdontograma: this.tipoOdontograma,
        edadCategoria: this.edadCategoria,
        fecha: this.fechaActual,
        operador: {
          role: this.userAuth.role,
          fullname: this.userAuth.fullname,
          email: this.userAuth.email,
        },
        odontograma: this.odontograma,
      };

      const paciente = {
        dni: this.paciente.dni,
        nombres: this.paciente.nombres,
        apellidos: this.paciente.apellidos,
        edad: this.paciente.edad,
        fechaRegistro: this.paciente.fechaRegistro,
        odontogramas: [odontograma],
      };

      const pacienteJSON = JSON.stringify(paciente);

      axios
        .post('http://localhost:3001/pacientes', pacienteJSON, {
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

  descargarPDF(){
    const dialogRef = this.dialog.open(DialogoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
      // Puedes realizar acciones después de que se cierre el diálogo si es necesario
    });
  }
}
