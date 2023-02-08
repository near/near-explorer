// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.Commands.overwrite("visit", (originalVisit, url, options) =>
  originalVisit(url, {
    ...options,
    onBeforeLoad: (contentWindow) =>
      // Setting language explicit to make tests same on machines with different locales
      (contentWindow.document.cookie = "NEXT_LOCALE=en"),
  })
);

// Alternatively you can use CommonJS syntax:
// require('./commands')
