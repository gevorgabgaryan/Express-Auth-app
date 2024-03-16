import { Router } from 'express'
import AuthController from '../controllers/authController'
import {
  validateRegisterData,
  validateLoginData,
} from '../middlewares/validation'
import { checkAuthorization } from '../middlewares/checkAuthorization'

const authRoutes = Router()

authRoutes.post('/register', validateRegisterData, AuthController.register)

authRoutes.post('/login', validateLoginData, AuthController.login)

authRoutes.post('/check-token', checkAuthorization(),  AuthController.getUserInfo)

authRoutes.get(
  '/logout',
  checkAuthorization(['admin', 'editor', 'user']),
  AuthController.logout
)

export default authRoutes
