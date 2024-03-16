import AuthService from '../services/AuthService'

class AuthController {
  static async register (req, res) {
    const { email, password, firstName, lastName } = req.body
    try {
      const result = await AuthService.register(
        email,
        password,
        firstName,
        lastName
      )
      res.status(200).json({
        status: true,
        result
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async login (req, res) {
    try {
      const { email, password  } = req.body
      const result = await AuthService.login(email, password)
      res.status(200).json({
        status: true,
        result
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async getUserInfo(req, res) {
    try {
      res.status(200).json({
          userId: req.userId,
          role: req.role
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

  static async logout (req, res) {
    try {
      const token = req.headers.Authorization
        ? req.headers.Authorization
        : req.headers.authorization
      const result = await AuthService.logout(req.userId, token.split(' ')[1])
      res.json({
        status: true,
        result
      })
    } catch (e) {
      console.log(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }

}

export default AuthController
