describe('create-product', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('test_storage_facility@test.com', 'test');
  });
  it('shhould go to ledger', () => {
    cy.get(':nth-child(5) > a').click();
  });
});
