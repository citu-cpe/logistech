describe('create-product', () => {
  beforeEach(() => {
    cy.resetTestData();
    cy.visit('/login');
    cy.login('test_supplier@test.com', 'test');
  });
  const PRODUCT_NAME = 'TEST';
  const EDITED_PRODUCT_NAME = 'BUANG';
  it('should be able to create a product, edit, and delete', () => {
    cy.get('li').contains('Products').click();
    cy.get('button').contains('Create').click();
    cy.fillOutProductForm(PRODUCT_NAME, 500, true, 5);
    cy.get('tr').contains(PRODUCT_NAME).should('exist');

    cy.getBySel('edit-product').first().click();
    cy.fillOutProductForm(EDITED_PRODUCT_NAME, 500, false, 5);
    cy.get('tr').contains(PRODUCT_NAME).should('not.exist');
    cy.get('tr').contains(EDITED_PRODUCT_NAME).should('exist');

    cy.getBySel('delete-product').first().click();
    cy.get('button').contains('Delete').click();
    cy.get('tr').contains(EDITED_PRODUCT_NAME).should('not.exist');
  });
});
