describe('Renderizado del título del odontograma inicial', () => {
  it('debería mostrar el título correctamente', () => {

    cy.visit('http://localhost:4200/odontograma/76904961');

    cy.get('h1').should('contain', 'Odontograma Inicial');
  });
});
