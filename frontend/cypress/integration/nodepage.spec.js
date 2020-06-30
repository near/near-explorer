/// <reference types="Cypress" />

context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  // https://on.cypress.io/interacting-with-elements

  it("check for node lists", () => {
    cy.get("#node-page").click();
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").find(".node-selector").contains("Validating");
    cy.get("#non-validator-node")
      .find(".node-selector")
      .contains("Non-Validating");
  });
});
