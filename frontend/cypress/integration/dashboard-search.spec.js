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
            cy.url({ timeout: 5000 }).should(
              "include",
              `/accounts/${mixedcaseAccountId.toLowerCase()}`
            );
            cy.request({
              method: "GET",
              url: `/accounts/${mixedcaseAccountId.toLowerCase()}`,
              timeout: 3000,
            }).then((resp) => {
              expect(resp.status).to.eq(200);
            });
          })
        );
      });
  });
});
