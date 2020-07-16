/// <reference types="Cypress" />

context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("https://explorer.betanet.near.org");
  });

  // https://on.cypress.io/interacting-with-elements

  it("check for node page", () => {
    cy.get("#node-page").click();
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").find(".node-selector").contains("Validating");
    cy.get("#non-validator-node")
      .find(".node-selector")
      .contains("Non-Validating");
  });
});
