/// <reference types="Cypress" />

context("Nodes", () => {
  beforeEach(() => {
    cy.visit("/nodes/validators");
  });

  // https://on.cypress.io/interacting-with-elements

  it("Check for node page", () => {
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").contains("Validating");
    // cy.get("#online-node").contains("Online-nodes");
    cy.get("#proposal-node").contains("Proposed");
  });

  it("Check validators tab", () => {
    cy.url().should("include", "/nodes/validators");
    cy.get(".node-selector").should("have.class", "node-selected");
    cy.get(".validator-nodes-row td", { timeout: 10000 }).should("exist");
  });

  // it("Check online nodes tab", () => {
  //   cy.get("#online-node").click();
  //   cy.get(".node-selector").should("have.class", "node-selected");
  //   cy.wait(3000)
  //     .get(".node-row .node-row-title")
  //     .within(($el) => cy.get($el).should("exist", $el.text()));
  //   cy.get(".node-row .node-row-txid").within(($el) =>
  //     cy.get($el).should("exist", $el.text())
  //   );
  // });

  it("Check proposal nodes tab", () => {
    cy.get("#proposal-node").click();
    cy.get(".node-selector").should("have.class", "node-selected");
  });

  // it("Check nodes map tab", () => {
  //   cy.get("#node-map").click();
  //   cy.wait(10000).get(".mapBackground").should("exist");
  // });
});
