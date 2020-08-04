/// <reference types="Cypress" />

context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/nodes/validators");
  });

  // https://on.cypress.io/interacting-with-elements

  it("check for node page", () => {
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").find(".node-selector").contains("Validating");
    cy.get("#online-node").find(".node-selector").contains("Online-nodes");
    cy.get("#proposal-node").find(".node-selector").contains("Proposal-nodes");
  });
});
