/// <reference types="Cypress" />

context("Dashboard search bar", () => {
  it("Search from the dashboard page should work for accounts in lower/upper/mixed case", () => {
    cy.fixture("mixedcase-account-ids.json")
      .as("mixedcaseAccountIds")
      .then((mixedcaseAccountIds) => {
        Cypress.Promise.all(
          mixedcaseAccountIds.map((mixedcaseAccountId) => {
            cy.visit("/");
            cy.get(".search-wrapper form.search-box .input-group input").type(
              mixedcaseAccountId
            );
            cy.get(".search-wrapper form.search-box").submit();
            cy.wait(5000);
            cy.url().should(
              "include",
              `/accounts/${mixedcaseAccountId.toLowerCase()}`
            );
            cy.wait(3000);
            cy.request(
              "GET",
              `/accounts/${mixedcaseAccountId.toLowerCase()}`
            ).then((resp) => {
              expect(resp.status).to.eq(200);
            });
          })
        );
      });
  });
});
