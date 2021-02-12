/// <reference types="Cypress" />

context("Nodes", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/nodes/validators");
  });

  // https://on.cypress.io/interacting-with-elements

  it("Check for node page", () => {
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").find(".node-selector").contains("Validating");
    cy.get("#online-node").find(".node-selector").contains("Online-nodes");
    cy.get("#proposal-node").find(".node-selector").contains("Proposal-nodes");
  });

  it("Check validators tab", () => {
    cy.url().should("include", "/nodes/validators");
    cy.get("#validator-node").should("have.class", "node-selected");
    cy.wait(3000)
      .get(".node-row .node-row-title")
      .within(($el) => cy.get($el).should("exist", $el.text()));
    cy.get(".node-row .node-row-text .row div").within(($el) =>
      cy.get($el).should("exist", $el.text())
    );
    cy.get(".node-row .node-row-txid").should("exist");
  });

  it("Check online nodes tab", () => {
    cy.get("#online-node").click();
    cy.get("#online-node").should("have.class", "node-selected");
    cy.wait(3000)
      .get(".node-row .node-row-title")
      .within(($el) => cy.get($el).should("exist", $el.text()));
    cy.get(".node-row .node-row-txid").within(($el) =>
      cy.get($el).should("exist", $el.text())
    );
  });

  it("Check proposal nodes tab", () => {
    cy.get("#proposal-node").click();
    cy.get("#proposal-node").should("have.class", "node-selected");
    cy.wait(3000)
      .get(".node-row .node-row-title")
      .within(($el) => cy.get($el).should("exist", $el.text()));
    cy.get(".node-row .node-row-txid").within(($el) =>
      cy.get($el).should("exist", $el.text())
    );
  });

  it("Check nodes map tab", () => {
    cy.get(".node-link").children("div").contains("Nodes Map").click();
    cy.visit("http://localhost:3000/nodes/map");
    cy.wait(5000).get(".mapBackground").should("exist");
  });
});
