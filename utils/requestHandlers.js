import ensureHttpMethod, { METHODS } from "utils/ensureHttpMethod"
import log from "utils/log"
import NetworkError from "utils/networkError"

function getHandler(method) {
  return (handlerFn) => {
    return async (req, res) => {
      try {
        ensureHttpMethod(req, method)

        await handlerFn(req, res)
      } catch (error) {
        log.error(error)

        res
          .status(error instanceof NetworkError ? error.code : 500)
          .end(error.message)
      }
    }
  }
}

const handlers = Object.values(METHODS).reduce((handlers, method) => {
  const handlerName = method.toLowerCase()

  handlers[handlerName] = getHandler(method)

  return handlers
}, {})

export default handlers
