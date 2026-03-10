describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.origin("login.bcc.no", () => {
      cy.get("main._widget input[name=username]").type(
        Cypress.env("LOGIN_USERNAME"),
      );
      cy.get("main._widget button[name=action]").click();
      cy.get("main._widget input[name=password]").type(
        Cypress.env("LOGIN_PASSWORD"),
        { log: false },
      );
      cy.get("main._widget button[name=action]").click();
    });

    cy.url().should("match", new RegExp(`^${Cypress.config().baseUrl}/`));
  });
});
