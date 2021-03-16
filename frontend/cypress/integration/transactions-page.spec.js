/// <reference types="Cypress" />

context("Transactions", () => {
  beforeEach(() => {
    cy.visit("/transactions");
  });

  it("Check page title", () => {
    cy.title().should("contain", "Transactions");
  });

  it("Check transactions row data", () => {
    cy.wait(5000).get(".infinite-scroll-component__outerdiv").should("exist");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find(".action-sparse-row")
      .should("have.length.greaterThan", 0)
      .then(($el) => {
        let itemsPerPage = $el.length;
        cy.scrollTo("bottom");
        cy.wait(3000)
          .get(
            ".infinite-scroll-component__outerdiv .infinite-scroll-component"
          )
          .find(".action-sparse-row")
          .should("have.length.greaterThan", itemsPerPage);
      });

    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find(".action-sparse-row")
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find(".action-sparse-row .action-row-details .action-row-title")
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find(".action-sparse-row .action-row-details .action-row-txid")
      .should("exist")
      .and("not.be.empty");
  });

  it("Check transaction details", () => {
    cy.wait(5000).get(".infinite-scroll-component__outerdiv").should("exist");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find(".action-sparse-row")
      .first()
      .get(".action-sparse-row:first-child .action-row-txid a")
      .click();
    cy.wait(10000);
    cy.get(".transaction-info-container").should("exist");
    cy.get(".transaction-info-container .card-cell .card-body")
      .should("exist")
      .and("not.be.empty");

    cy.get(".content-title")
      .find("h2")
      .each(($el) => {
        if ($el.text() === "Actions") {
          cy.get(".action-sparse-row").should("exist").and("not.be.empty");
          cy.get(".action-sparse-row .action-row-details")
            .should("exist")
            .and("not.be.empty");
        }
        if ($el.text() === "Receipts") {
          cy.get(".receipt-row").should("exist").and("not.be.empty");
          cy.get(".receipt-row .receipt-row-title")
            .should("exist")
            .and("not.be.empty");
          cy.get(".receipt-row .receipt-row-receipt-hash")
            .should("exist")
            .and("not.be.empty");
        }
      });
  });
});
