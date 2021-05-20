/// <reference types="Cypress" />

context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // https://on.cypress.io/interacting-with-elements

  it("Logo is visible", () => {
    cy.get(".header-container .near-main-logo").should("exist");
  });

  it("Search bar is visible", () => {
    cy.get(".search-wrapper form.search-box").should("exist");
  });

  it("Cards area is visible", () => {
    cy.get(".card-area").should("exist");
  });

  it("Nodes card is visible", () => {
    cy.get(".card-area .dashboard-card.node-card").should("exist");
    cy.get(
      ".card-area .dashboard-card.node-card .dashboard-card-header"
    ).contains("Nodes");
    cy.get(".card-area .dashboard-card.node-card a .long-card-cell.href-cell", {
      timeout: 5000,
    })
      .should("exist")
      .each(($el) =>
        cy
          .get($el)
          .children(".col")
          .find(".card-cell-text")
          .not(".spinner-border")
      );
  });

  it("Blocks card is visible", () => {
    cy.get(".card-area .dashboard-card.block-card").should("exist");
    cy.get(
      ".card-area .dashboard-card.block-card .dashboard-card-header"
    ).contains("Blocks");
    cy.get(".card-area .dashboard-card.block-card .card-cell-text", {
      timeout: 5000,
    })
      .should("exist")
      .each(($el) =>
        cy.get($el, { timeout: 10000 }).should("not.equal", $el.text())
      );
  });

  it("Transactions card is visible", () => {
    cy.get(".dashboard-card.transaction-card").should("exist");
    cy.get(".dashboard-card.transaction-card .dashboard-card-header").contains(
      "Transactions"
    );
    cy.get(
      ".dashboard-card.transaction-card .transaction-card-number >div:first-child"
    ).should("exist");
    cy.get(
      ".dashboard-card.transaction-card .transaction-card-number >div:first-child .long-card-cell .card-cell-text",
      { timeout: 5000 }
    )
      .should("exist")
      .within(($element) =>
        cy
          .get($element, { timeout: 10000 })
          .should("not.equal", $element.text())
      );

    cy.get(
      ".dashboard-card.transaction-card .transaction-card-number >div:last-child"
    ).should("exist");
    cy.get(
      ".dashboard-card.transaction-card .transaction-card-number >div:last-child span"
    ).should("not.be.empty");
    cy.get(".dashboard-card.transaction-card").should("exist");
    // Hide this check for some time
    // cy.get(
    //   ".dashboard-card.transaction-card .transaction-charts.row .echarts-for-react canvas",
    //   { timeout: 20000 }
    // ).should("exist");
  });
});
