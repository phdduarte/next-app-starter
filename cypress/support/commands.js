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
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { v4 as uuidv4 } from "uuid"
import "@testing-library/cypress/add-commands"

import initFirebase, { getAuth } from "../../lib/firebase"
import { setUserCookie, removeUserCookies } from "../../lib/cookies"

const config = {
  apiKey: Cypress.env("FIREBASE_PUBLIC_API_KEY"),
  authDomain: Cypress.env("FIREBASE_AUTH_DOMAIN"),
  databaseURL: Cypress.env("FIREBASE_DATABASE_URL"),
  projectId: Cypress.env("FIREBASE_PROJECT_ID"),
}

initFirebase(config)

Cypress.Commands.add("login", () => {
  const uid = uuidv4()

  return cy.task("createCustomToken", { uid }).then((token) => {
    getAuth().signInWithCustomToken(token)

    setUserCookie({ uid, name: "Test" })
  })
})

Cypress.Commands.add("logout", () => {
  getAuth()
    .signOut()
    .then(() => removeUserCookies())
})
