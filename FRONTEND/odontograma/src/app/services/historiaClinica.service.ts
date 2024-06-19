import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HistoriaClinicaService {
  constructor(private http: HttpClient) {}

  getPacienteAleatorio(): Observable<any> {
    return this.http.get<any[]>('https://backend-nine-amber-97.vercel.app/historiaClinica');
  }

  getUserAuthAleatorio(): Observable<any> {
    return this.http.get<any>('https://backend-nine-amber-97.vercel.app/userAuth');
  }


  buscarPaciente(query: string): Observable<any[]> {
    return this.http.get<any[]>('https://backend-nine-amber-97.vercel.app/pacientes').pipe(
      map((data: any[]) => {
        return data.filter(paciente =>
          paciente.nombres.toLowerCase().includes(query.toLowerCase()) ||
          paciente.apellidos.toLowerCase().includes(query.toLowerCase()) ||
          paciente.dni.includes(query)
        );
      })
    );
  }
}
