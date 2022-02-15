context("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  // https://on.cypress.io/interacting-with-elements

  it("Logo is visible", () => {
    cy.get("@HeaderContainer @NearLogo").should("exist");
  });

  it("Search bar is visible", () => {
    cy.get("@SearchWrapper @SearchBox").should("exist");
  });

  it("Cards area is visible", () => {
    cy.get("@InnerContent").should("exist");
  });

  it.skip("Nodes card is visible", () => {
    const nodesDashboardCard =
      '@InnerContent @DashboardCardWrapper[data-id="nodes"]';
    cy.get(nodesDashboardCard).should("exist");
    cy.get(`${nodesDashboardCard} @DashboardCardHeader`).contains("Nodes");
    cy.get(`${nodesDashboardCard} .spinner-border`, {
      timeout: 15000,
    }).should("not.exist");
    cy.get(`${nodesDashboardCard} @LongCardCell @CardCellText`, {
      timeout: 5000,
    })
      .should("exist")
      .first()
      .invoke("text")
      .should("match", /^\d+$/);
  });

  it("Blocks card is visible", () => {
    const blocksDashboardCard =
      '@InnerContent @DashboardCardWrapper[data-id="blocks"]';
    cy.get(blocksDashboardCard).should("exist");
    cy.get(`${blocksDashboardCard} @DashboardCardHeader`).contains("Blocks");
    cy.get(`${blocksDashboardCard} @LongCardCell @CardCellText`, {
      timeout: 5000,
    })
      .should("exist")
      .first()
      .invoke("text")
      .should("match", /^\d+$/);
  });

  it("Transactions card is visible", () => {
    const transactionsDashboardCard =
      '@InnerContent @DashboardCardWrapper[data-id="transactions"]';
    cy.get(transactionsDashboardCard).should("exist");
    cy.get(`${transactionsDashboardCard} @DashboardCardHeader`).contains(
      "Transactions"
    );

    cy.get(
      `${transactionsDashboardCard} @TransactionCardNumber > *:first-child @CardCellText`,
      {
        timeout: 5000,
      }
    )
      .should("exist")
      .first()
      .invoke("text")
      .should("match", /^[\d ,]+$/);

    cy.get(
      `${transactionsDashboardCard} @TransactionCardNumber > *:last-child @CardCellText`
    ).should("exist");
    cy.get(
      `${transactionsDashboardCard} @TransactionCardNumber > *:last-child @CardCellText span`
    ).should("not.be.empty");
    // Hide this check for some time
    // cy.get(
    //   ".dashboard-card.transaction-card .transaction-charts.row .echarts-for-react canvas",
    //   { timeout: 20000 }
    // ).should("exist");
  });
});
