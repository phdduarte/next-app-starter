export default {
  error(...args) {
    if (process.env.NODE_ENV === "development") {
      console.log(...args)
    }
  },
}
