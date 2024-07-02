describe('Renderizado del título del odontograma inicial', () => {
  it('debería mostrar el título correctamente', () => {
    cy.visit('https://5r1t37dq-4200.brs.devtunnels.ms/odontograma/63652581');
    cy.get('.tunnel--dwithport-text22 > span').click();
    cy.get('h1').should('contain', 'Odontograma Inicial');
  });
});
