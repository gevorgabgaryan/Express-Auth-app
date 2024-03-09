import logger from "../shared/logger"
import semver from 'semver'

class RegisterService {
    constructor () {
        this.services = {}
        this.timeout = 60
      }

      register (name, version, ip, port) {
        this.cleanup();

        const key = this.getKey(name, version, ip, port)
        if (!this.services[key]) {
          this.services[key] = {}
          this.services[key].timestamp = Math.floor(new Date() / 1000)
          this.services[key].ip = ip

          this.services[key].port = port
          this.services[key].name = name
          this.services[key].version = version

          logger.info(`Added service ${name}, ${version} at ${ip} ${port}`)

          return key
        }

        this.services[key].timestamp = Math.floor(new Date() / 1000);
        console.log(`Updated service ${name}, ${version} at ${ip} ${port}`)
        return key
      }

      unregister (name, version, ip, port) {
        const key = this.getKey(name, version, ip, port)
        delete this.services[key]
        return key
     }

     get (name, version) {
        this.cleanup()
        const potentials = Object.values(this.services).filter((service) => {
          return (service.name === name && semver.satisfies(service.version, version))
        })
        return potentials[Math.floor(Math.random() * potentials.length)]
      }

      getKey (name, version, ip, port) {
        return name + version + ip + port
      }

      cleanup () {
        const now = Math.floor(new Date() / 1000)
        Object.keys(this.services).forEach((key) => {
          if (this.services[key].timestamp + this.timeout < now) {
            delete this.services[key]
            logger.info(`Removed expired service ${key}`)
          }
        })
      }

}

export default RegisterService;
