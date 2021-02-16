/// <reference types="Cypress" />

context("Dashboard search bar", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Search from the dashboard page should work for accounts in lower/upper/mixed case", () => {
    cy.get(".search-wrapper form.search-box .input-group input")
      .should("exist")
      .focus()
      .fixture("dashboard-fixtures.json")
      .as("testData")
      .then((data) => {
        data.searchData.forEach((i, index) => {
          cy.get(".search-wrapper form.search-box .input-group input").type(i);
          cy.get(".search-wrapper form.search-box").submit();
          cy.wait(5000);
          cy.url().should(
            "eq",
            `http://localhost:3000/accounts/${i.toLowerCase()}`
          );
          cy.wait(3000);
          cy.request(
            "GET",
            `http://localhost:3000/accounts/${i.toLowerCase()}`
          ).then((resp) => {
            expect(resp.status).to.eq(200);
          });

          cy.visit("http://localhost:3000");
          if (index + 1 < data.searchData.length) {
            cy.wait(2000);
          }
        });
      });
  });
});
