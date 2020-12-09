export default class UserError extends Error {
  constructor(titleOrMessage, message) {
    super(message ?? titleOrMessage)

    if (message != null) {
      this.title = titleOrMessage
    }
  }
}
