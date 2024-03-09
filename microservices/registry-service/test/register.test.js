import request from 'supertest'
import API from '../API/API'
let server

describe('test the service register API', () => {
  beforeAll(async () => {
    server = await API.init()
  })

  afterAll(async () => {
    if (server) {
      server.close()
    }
  })

  // Test adding a service
  it('should add a service', async () => {
    const service = {
      name: 'service',
      version: 1,
      port: 3030
    }

    const res = await request(server).put(`/register/${service.name}/${service.version}/${service.port}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: {
          key: `${service.name}${service.version}127.0.0.1${service.port}`
        }
      })
    )
  })

  // Test removea service
  it('should remove a service', async () => {
    const service = {
      name: 'service',
      version: 1,
      port: 3030
    }

    const res = await request(server).delete(`/register/${service.name}/${service.version}/${service.port}`)
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        status: true,
        result: {
          key: `${service.name}${service.version}127.0.0.1${service.port}`
        }
      })
    )
  })
})
