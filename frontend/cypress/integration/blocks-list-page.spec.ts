context("Blocks List page", () => {
  beforeEach(() => {
    cy.intercept("GET", "/blocks").as("blocksList");
    cy.visit("/blocks");
  });

  it("Check page title", () => {
    cy.title().should("contain", "Blocks");
  });

  it("Check blocks row data", () => {
    cy.wait("@blocksList");
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 5000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRow")
      .should("have.length.greaterThan", 0)
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRow @TransactionRowTitle")
      .should("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRow @TransactionRowTransactionId")
      .should("not.be.empty");
  });

  it("Check block details", () => {
    cy.wait("@blocksList");
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 5000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("a @TransactionRow")
      .first()
      .click();
    cy.get("@BlockInfoContainer", { timeout: 5000 }).should("exist");
    cy.get("@BlockInfoContainer @CardCell .card-body")
      .should("exist")
      .and("not.be.empty");

    cy.get("@ContentHeader").then(($el) => {
      if (
        $el.children("h2").length > 0 &&
        $el.children("h2").text() === "Transactions"
      ) {
        cy.get(".infinite-scroll-component__outerdiv").should("exist");
        cy.get(
          ".infinite-scroll-component__outerdiv .infinite-scroll-component"
        ).then(($childEl) => {
          if ($childEl.find("@ActionRow@type-sparse").length > 0) {
            cy.get($childEl.toString())
              .find("@ActionRow@type-sparse")
              .should("exist")
              .and("not.be.empty");
          } else {
            cy.log("there is no transactions");
          }
        });
      }
    });
  });
});
