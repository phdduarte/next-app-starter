import NetworkError from "utils/networkError";

export default function ensureHttpMethod(req, method) {
  if (req.method !== method) {
    throw new NetworkError(405);
  }
}

export const METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
};
