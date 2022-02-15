// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const replaceSelectorStitchesClass = (selector) => {
  return selector
    .replace(/\@([\w-]+)@([\w-]+)/g, '[class*="c-$1"][class*="$2"]')
    .replace(/\@([\w-]+)/g, '[class*="c-$1"]');
};

Cypress.Commands.overwrite("find", (originalFn, context, selector, options) => {
  return originalFn(context, replaceSelectorStitchesClass(selector), options);
});

Cypress.Commands.overwrite("get", (originalFn, selector, options) => {
  return originalFn(replaceSelectorStitchesClass(selector), options);
});
