import jwt from 'jsonwebtoken'

export const checkAuthorization = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.Authorization
        ? req.headers.Authorization
        : req.headers.authorization

      if (!token || token.split(' ').length !== 2) {
        return res.json({
          code: 401,
          message: 'unauthorized'
        })
      }
      const payload = jwt.verify(token, config.JWTSecret)
      const { userId, role } = payload

      if (role === 'admin') {
        throw new Error('Access denied')
      }

      next()
    } catch (e) {
      console.log(e)
      res.json({
        message: 'unauthorized'
      })
    }
  }
}
