describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:9001");

    cy.origin("login.bcc.no", () => {
      cy.get("form.auth0-lock-widget input[name=email]").type(
        Cypress.env("LOGIN_USERNAME")
      );
      cy.get("form.auth0-lock-widget input[name=password]").type(
        Cypress.env("LOGIN_PASSWORD"),
        { log: false }
      );
      cy.get("form.auth0-lock-widget button[name=submit]").click();
    });

    cy.url().should("match", /^http:\/\/localhost:9001\//);
  });
});
