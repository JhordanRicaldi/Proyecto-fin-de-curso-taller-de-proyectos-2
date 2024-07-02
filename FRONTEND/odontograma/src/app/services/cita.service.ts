import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CitaService {
  constructor(private http: HttpClient) { }

  getPacienteYUsuarioByDNI(dni: string): Observable<any> {
    return this.http.get<any[]>('https://nimble-flowery-almandine.glitch.me/cita').pipe(
      map(citas => {
        const citaConPaciente = citas.find(cita => cita.paciente.dni === dni);
        return citaConPaciente ? {
          fecha: citaConPaciente.fecha,
          hora: citaConPaciente.hora,
          odontologo: citaConPaciente.odontologo,
          motivo: citaConPaciente.motivo,
          sede: citaConPaciente.sede,
          extras: citaConPaciente.extras,
          paciente: citaConPaciente.paciente,
          usuario: citaConPaciente.usuario,
        } : null;
      })
    );
  }

  getTodosLasCitas(): Observable<any[]> {
    return this.http.get<any[]>('https://nimble-flowery-almandine.glitch.me/cita');
  }

}
