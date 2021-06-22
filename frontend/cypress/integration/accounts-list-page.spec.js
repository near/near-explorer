/// <reference types="Cypress" />

context("Accounts List page", () => {
  beforeEach(() => {
    cy.visit("/accounts");
  });

  it("Check page title", () => {
    cy.title().should("contain", "Accounts");
  });

  it("Check accounts row data", () => {
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 5000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row .transaction-row-title", { timeout: 3000 })
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row .transaction-row-txid")
      .should("exist")
      .then(($el) => {
        if ($el.children().length > 0) {
          cy.get($el).children("span").should("exist").and("not.be.empty");
        }
      });

    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row")
      .should("have.length.greaterThan", 0)
      .then(($el) => {
        let itemsPerPage = $el.length;
        cy.scrollTo("bottom");
        cy.get(
          ".infinite-scroll-component__outerdiv .infinite-scroll-component",
          { timeout: 5000 }
        )
          .find("a .transaction-row", { timeout: 3000 })
          .should("have.length.greaterThan", itemsPerPage);
      });
  });

  it("Check account details", () => {
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 5000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row .transaction-row-title")
      .should("exist")
      .first()
      .click();
    cy.get(".account-info-container", { timeout: 5000 }).should("exist");
    cy.get(".account-info-container .card-cell .card-body")
      .should("exist")
      .and("not.be.empty");

    cy.get(".content-title").then(($el) => {
      if (
        $el.children("h2").length > 0 &&
        $el.children("h2").text() === "Transactions"
      ) {
        cy.get(".infinite-scroll-component__outerdiv").should("exist");
        cy.get(
          ".infinite-scroll-component__outerdiv .infinite-scroll-component"
        )
          .find(".action-sparse-row")
          .should("not.be.empty");
      }
    });
  });
});
