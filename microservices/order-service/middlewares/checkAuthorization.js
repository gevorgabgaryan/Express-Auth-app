import logger from "../shared/logger"
import jwt from "jsonwebtoken"

export const checkAuthorization = (authorizationRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.Authorization
        ? req.headers.Authorization
        : req.headers.authorization
      if (!token || token.split(" ").length !== 2) {
        return res.json({
          code: 401,
          message: "unauthorized",
        })
      }
      const payload = jwt.verify(token, Config.JWTSecret)
      const { userId, role } = payload
      if (authorizationRoles && !authorizationRoles.includes(role)) {
        throw new Error("Access denied")
      }
      req.role = role
      req.userId = userId
      next()
    } catch (e) {
      logger.error(e)
      res.json({
        message: "unauthorized",
      })
    }
  }
}
