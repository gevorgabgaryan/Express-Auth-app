import UserService from './UserService'
import MailSenderService from './MailSenderService'
import jwt from 'jsonwebtoken'
import config from '../config'

class AuthService {
  static async register (email, password, firstName, lastName) {
    const existingEmail = await UserService.findByEmail(email)
    if (existingEmail) {
      return {
        message: 'The given email already exists'
      }
    }

    const newUser = await UserService.addUser(
      email,
      password,
      firstName,
      lastName
    )

    let isEmailSend = false
    if (process.env.NODE_ENV !== 'production') {
      isEmailSend = await MailSenderService.sendMail(
        email,
        newUser.verificationToken,
        'Verification Code'
      )
    }

    return {
      id: newUser.id,
      isEmailSend,
      message: 'Account was created'
    }
  }

  static async login (email, password) {
    const user = await UserService.findByEmail(email)
    if (!user) {
      return 'invalid credentials'
    }

    const isMatched = user.comparePassword(password)

    if (!isMatched) {
      return 'invalid credentials'
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      config.JWTSecret,
      {
        expiresIn: '3h'
      }
    )

    return { userId: user.id, email: user.email, token }
  }

  static async checkToken (token, authorizationRoles) {
    try {
      const payload = jwt.verify(token, config.JWTSecret)
      const { userId, role } = payload

      if (authorizationRoles && !authorizationRoles.includes(role)) {
        throw new Error('Access denied')
      }
      return { userId, role }
    } catch (e) {
      console.log(e)
      throw new Error(JSON.stringify(e))
    }
  }

  static async logout (userId, token) {
    const redisClient = config.redis.client
    await redisClient.srem(`user:${userId}:tokens`, token)
    return {
      message: 'logout succesful'
    }
  }
}

export default AuthService
