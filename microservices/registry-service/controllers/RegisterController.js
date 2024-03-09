import RegisterService from '../serveces/RegisterService'
import { CustomError } from '../shared/error'
import HttpStatusCode from '../shared/httpStatusCodes'

const registry = new RegisterService()

class RegisterController {
    static async register (req, res) {
        try {
          const { servicename, serviseversion, serviceip, serviceport } = RegisterController.getReqArguments(req)
          const key = registry.register(servicename, serviseversion, serviceip, serviceport)
          res.promisify({ key })
        } catch (e) {
          res.promisify(e)
        }
      }

      static async unregister (req, res) {
        try {
          const { servicename, serviseversion, serviceport, serviceip } = RegisterController.getReqArguments(req)
          const key = registry.unregister(servicename, serviseversion, serviceip, serviceport)
          res.promisify({ key })
        } catch (e) {
          res.promisify(e)
        }
      }

      static async find (req, res) {
        try {
          const { servicename, serviseversion } = RegisterController.getReqArguments(req)
          const service = registry.get(servicename, serviseversion)
          if (!service) {
            throw new CustomError('servcie not found', 'FIND_SERVICE', HttpStatusCode.BAD_REQUEST)
          }
          res.promisify(service)
        } catch (e) {
          res.promisify(e)
        }
      }

      static getReqArguments (req) {
        const { servicename, serviseversion, serviceport } = req.params
        let serviceip = req.ip
        if (serviceip.includes('::')) {
          serviceip = '127.0.0.1'
        }
        return { servicename, serviseversion, serviceip, serviceport }
      }

}

export default RegisterController
