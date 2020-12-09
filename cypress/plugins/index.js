/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require("path")
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.local"),
})

const admin = require("firebase-admin")
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  } catch (error) {
    if (!/already exists/u.test(error.message)) {
      console.error("Firebase admin initialization error", error.stack)
    }
  }
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env.FIREBASE_PUBLIC_API_KEY =
    process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY
  config.env.FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  config.env.FIREBASE_DATABASE_URL =
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  config.env.FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  on("task", {
    createCustomToken(opts) {
      return admin.auth().createCustomToken(opts.uid)
    },
  })

  return config
}
