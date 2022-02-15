context("Transactions", () => {
  beforeEach(() => {
    cy.intercept("GET", "/transactions").as("transactionsList");
    cy.visit("/transactions");
  });

  it("Check page title", () => {
    cy.title().should("contain", "Transactions");
  });

  it("Check transactions row data", () => {
    cy.wait("@transactionsList");
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 20000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("@ActionRow@type-sparse")
      .should("have.length.greaterThan", 0)
      .then(($el) => {
        let itemsPerPage = $el.length;
        cy.scrollTo("bottom")
          .get(
            ".infinite-scroll-component__outerdiv .infinite-scroll-component",
            { timeout: 5000 }
          )
          .find("@ActionRow@type-sparse", { timeout: 5000 })
          .should("have.length.greaterThan", itemsPerPage);
      });

    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("@ActionRow@type-sparse")
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("@ActionRow@type-sparse @ActionRowDetails @ActionRowTitle")
      .should("exist")
      .and("not.be.empty");
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("@ActionRow@type-sparse @ActionRowDetails @ActionRowTitle")
      .should("exist")
      .and("not.be.empty");
  });

  it("Check transaction details", () => {
    cy.wait("@transactionsList");
    cy.get(".infinite-scroll-component__outerdiv", { timeout: 20000 }).should(
      "exist"
    );
    cy.get(".infinite-scroll-component__outerdiv .infinite-scroll-component")
      .find("@ActionRow@type-sparse")
      .first()
      .get("@ActionRow@type-sparse @ActionRowTransaction a")
      .first()
      .click();
    cy.get("@TransactionInfoContainer", { timeout: 20000 }).should("exist");
    cy.get("@TransactionInfoContainer @CardCell .card-body")
      .should("exist")
      .and("not.be.empty");

    cy.get("@ContentContainer")
      .find("h2")
      .each(($el) => {
        if ($el.text() === "Actions") {
          cy.get("@ActionRow@type-sparse").should("exist").and("not.be.empty");
          cy.get("@ActionRow@type-sparse @ActionRowDetails")
            .should("exist")
            .and("not.be.empty");
        }
        if ($el.text() === "Receipts") {
          cy.get("@ReceiptRowWrapper").should("exist").and("not.be.empty");
          cy.get("@ReceiptRowWrapper @ReceiptRowTitle")
            .should("exist")
            .and("not.be.empty");
          cy.get("@ReceiptRowWrapper @ReceiptRowReceiptHash")
            .should("exist")
            .and("not.be.empty");
        }
      });
  });
});
