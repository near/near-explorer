/// <reference types="Cypress" />

context("Accounts", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/accounts");
  });

  it("Check page title", () => {
    cy.title().should("contain", "Accounts");
  });

  it("Check accounts row data", () => {
    cy.wait(5000).get(".infinite-scroll-component__outerdiv").should("exist");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row .transaction-row-title")
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
        cy.wait(3000)
          .get(
            ".infinite-scroll-component__outerdiv .infinite-scroll-component"
          )
          .find("a .transaction-row")
          .should("have.length.greaterThan", itemsPerPage);
      });
  });

  it("Check account details", () => {
    cy.wait(5000).get(".infinite-scroll-component__outerdiv").should("exist");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a .transaction-row .transaction-row-title")
      .should("exist")
      .first()
      .click();
    cy.wait(5000);
    cy.get(".account-info-container").should("exist");
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
