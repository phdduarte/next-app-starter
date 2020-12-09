import { cache } from "swr"

describe("Join", () => {
  beforeEach(() => {
    cy.visit("/join")
    cache.clear()
  })

  it("should be able to log in", () => {
    cy.findByPlaceholderText("Phone Number").as("phoneInput").type("6134567898")
    cy.get("@phoneInput").invoke("val").should("equal", "(613) 456-7898")
    cy.findByPlaceholderText("Name").type("Eric")
    cy.findByText("Join now").click()

    cy.findByPlaceholderText("Code").should("exist")
    cy.findByPlaceholderText("Code").type("12345")
    cy.findByText("Verify").click()

    cy.wait(200)
    cy.findByText("Dashboard").should("exist")
    cy.findByText("Welcome Eric").should("exist")
    cy.getCookie("authed").should("exist")
  })

  it("should not redirect if login fails", () => {
    cy.window().then((win) => {
      const { worker, rest } = win.msw

      worker.use(
        rest.post("/api/user/create", (req, res, ctx) => {
          return res.once(ctx.status(400))
        }),
      )
    })

    cy.findByPlaceholderText("Phone Number").as("phoneInput").type("6134567898")
    cy.get("@phoneInput").invoke("val").should("equal", "(613) 456-7898")
    cy.findByPlaceholderText("Name").type("Eric")
    cy.findByText("Join now").click()

    cy.findByPlaceholderText("Code").type("12345")
    cy.findByText("Verify").click()

    cy.findByText("Dashboard").should("not.exist")
    cy.getCookie("authed").should("not.exist")
  })

  it("should login without the interface", () => {
    cy.login()

    cy.visit("/dashboard")

    cy.findByText("Dashboard").should("exist")
    cy.findByText("Welcome Test").should("exist")
  })

  it("should redirect home if not logged in", () => {
    cy.logout()
    cy.visit("/dashboard")
    cy.findByText("Dashboard").should("not.exist")
  })
})
