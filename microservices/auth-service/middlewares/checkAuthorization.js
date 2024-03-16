import AuthService from '../services/authService'

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
      const { userId, role } = await AuthService.checkToken(
        token.split(' ')[1],
        roles
      )
      req.role = role
      req.userId = userId
      next()
    } catch (e) {
      console.log(e)
      res.json({
        message: 'unauthorized'
      })
    }
  }
}
