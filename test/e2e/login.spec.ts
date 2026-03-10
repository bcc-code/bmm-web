import { describe, it, _should } from "vitest";
import { cy } from "cypress";

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

    cy.url()._should("match", new RegExp(`^${Cypress.config().baseUrl}/`));
  });
});
