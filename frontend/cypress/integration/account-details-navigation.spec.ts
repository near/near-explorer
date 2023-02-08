context("Account Details navigation", () => {
  it("Direct navigation to /accounts/:accountId page should work for accounts in lower/upper/mixed case", () => {
    cy.fixture("mixedcase-account-ids.json")
      .as("mixedcaseAccountIds")
      .then((mixedcaseAccountIds) => {
        Cypress.Promise.all(
          mixedcaseAccountIds.map((mixedcaseAccountId) => {
            cy.request({
              method: "GET",
              url: `/accounts/${mixedcaseAccountId}`,
              followRedirect: true,
            }).then((resp) => {
              expect(resp.status).to.eq(200);
            });
          })
        );
      });
  });

  it("Direct navigation to /accounts/:accountId page with account ID in upper/mixed case should return HTTP 308 (Permanent Redirect)", () => {
    cy.fixture("mixedcase-account-ids.json")
      .as("mixedcaseAccountIds")
      .then((mixedcaseAccountIds) => {
        Cypress.Promise.all(
          mixedcaseAccountIds.map((mixedcaseAccountId) => {
            cy.request({
              method: "GET",
              url: `/accounts/${mixedcaseAccountId}`,
              followRedirect: false,
            }).then((resp) => {
              if (mixedcaseAccountId === mixedcaseAccountId.toLowerCase()) {
                expect(resp.status).to.eq(200);
              } else {
                expect(resp.status).to.eq(308);
                expect(resp.redirectedToUrl).to.include(
                  `/accounts/${mixedcaseAccountId.toLowerCase()}`
                );
              }
            });
          })
        );
      });
  });
});
