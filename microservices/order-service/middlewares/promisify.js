import { responseSender } from '../utils/util'

export const promisifyAPI = () => {
  return (req, res, next) => {
    res.promisify = (p) => {
      let resolvePromise
      if (p.then && p.catch) {
        resolvePromise = p
      } else if (typeof p === 'function') {
        resolvePromise = Promise.resolve().then(() => p())
      } else {
        resolvePromise = Promise.resolve(p)
      }

      return resolvePromise
        .then(data => responseSender(null, res, data))
        .catch(e => responseSender(e, res))
    }
    return next()
  }
}
