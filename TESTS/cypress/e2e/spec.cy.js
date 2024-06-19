describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200');


    cy.contains('button', ' Guardar Odontograma ').click({force:true});
   
    cy.get('#especificaciones')
      .type('Especificaciones de prueba para el paciente'); 
    cy.get('#observaciones')
      .type('Observaciones de prueba para el paciente'); 

      cy.get('[aria-describedby="cdk-describedby-message-ng-1-57"]').click({ force: true });

      
      cy.contains('Corona')
      .click();
      cy.contains('Limpieza')
      .click();
      cy.contains('Carillas')
      .click();    

    
      cy.get('[aria-describedby="cdk-describedby-message-ng-1-131"]').click({ force: true });
      cy.contains('Cirugía')
      .click();    

      cy.get('[aria-describedby="cdk-describedby-message-ng-1-117"]').click({ force: true });
      cy.contains('Carillas')
      .click();    


      cy.contains('button', ' Guardar Odontograma ').click({force:true});

      cy.contains('button', ' Aceptar ').click({force:true});


  });
});