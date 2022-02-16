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
      .find("a @TransactionRowTitle", { timeout: 3000 })
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRowTransactionId")
      .should("exist")
      .then(($el) => {
        if ($el.children().length > 0) {
          cy.get($el.toString())
            .children("span")
            .should("exist")
            .and("not.be.empty");
        }
      });

    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRow")
      .should("have.length.greaterThan", 0)
      .then(($el) => {
        let itemsPerPage = $el.length;
        cy.scrollTo("bottom");
        cy.get(
          ".infinite-scroll-component__outerdiv .infinite-scroll-component",
          { timeout: 5000 }
        )
          .find("a @TransactionRow", { timeout: 3000 })
          .should("have.length.greaterThan", itemsPerPage);
      });
  });

  it("Check account details", () => {
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 5000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRowTitle")
      .should("exist")
      .first()
      .click();
    cy.get("@AccountInfoContainer", { timeout: 5000 }).should("exist");
    cy.get("@AccountInfoContainer @CardCell .card-body")
      .should("exist")
      .and("not.be.empty");

    cy.get("@ContentContainer").then(($el) => {
      if (
        $el.children("h2").length > 0 &&
        $el.children("h2").text() === "Transactions"
      ) {
        cy.get(".infinite-scroll-component__outerdiv").should("exist");
        cy.get(
          ".infinite-scroll-component__outerdiv .infinite-scroll-component"
        )
          .find("@ActionRow@type-sparse")
          .should("not.be.empty");
      }
    });
  });
});
