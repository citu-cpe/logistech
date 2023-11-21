describe('create-product', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('test_supplier@test.com', 'test');
  });
  it('shhould go to ledger', () => {
    cy.get(':nth-child(8) > a').click();
  });
});
