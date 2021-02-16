/// <reference types="Cypress" />

context("Dashboard navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Direct navigation to /accounts/:accountId page should work for accounts in lower/upper/mixed case", () => {
    cy.fixture("dashboard-fixtures.json")
      .as("testNavigationData")
      .then((data) => {
        data.navigationData.forEach((i, index) => {
          cy.visit(i);
          cy.request("GET", i).then((resp) => {
            expect(resp.status).to.eq(200);
          });

          cy.visit("http://localhost:3000");

          if (index + 1 < data.navigationData.length) {
            cy.wait(2000);
          }
        });
      });
  });

  it("Direct navigation to /accounts/:accountId page with account ID in upper/mixed case should return HTTP 301 (Permanent Redirect)", () => {
    cy.fixture("dashboard-fixtures.json")
      .as("testNavigationData")
      .then((data) => {
        data.navigationData.forEach((i, index) => {
          cy.visit(i);
          cy.request({
            method: "GET",
            url: i,
            followRedirect: false,
          }).then((resp) => {
            expect(resp.status).to.eq(301);
            expect(resp.redirectedToUrl).to.eq(i.toLowerCase());
          });

          cy.visit("http://localhost:3000");

          if (index + 1 < data.navigationData.length) {
            cy.wait(2000);
          }
        });
      });
  });
});
