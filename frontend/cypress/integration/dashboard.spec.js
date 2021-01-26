/// <reference types="Cypress" />

context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  // https://on.cypress.io/interacting-with-elements

  it("Logo is visible", () => {
    cy.get(".header-container .near-main-logo").should("exist");
  });
});
