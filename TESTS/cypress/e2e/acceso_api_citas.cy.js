describe('Verificación de acceso a los datos de las citas', () => {
  it('Accede a la ruta de citas y verifica la estructura de la respuesta', () => {
    cy.request('https://nimble-flowery-almandine.glitch.me/cita').then((response) => {
      expect(response.status).to.eq(200);
      response.body.forEach((cita) => {        
        expect(cita).to.include.keys('id', 'fecha', 'hora', 'odontologo', 'motivo', 'sede', 'extras', 'paciente', 'usuario');
                
        expect(cita.paciente).to.include.keys(
          'id', 'FechaCreacion', 'HoraCreacion', 'dni', 'Nombre', 'ApellidoPaterno', 
          'ApellidoMaterno', 'Sexo', 'Lugar', 'Domicilio', 'FechaNacimiento', 
          'EstadoCivil', 'NroCelular', 'Correo', 'Ocupacion', 'Responsable', 
          'DomicilioResponsable', 'CelularResponsable', 'MotivoConsulta'
        );
                
        expect(cita.usuario).to.include.keys(
          'id', 'codigo', 'email', 'password', 'estado', 'rol', 'nombre', 
          'apellido', 'phone', 'genero', 'foto', 'firmadigital', 'colegiatura'
        );
      });
    });
  });
});
