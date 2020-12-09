export default class NetworkError extends Error {
  code = 500

  constructor(code, options = { message: "" }) {
    super(options.message)

    if (code != null) {
      this.code = code
    }
  }
}
