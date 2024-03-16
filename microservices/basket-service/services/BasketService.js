class BasketService {
  constructor (client, userId) {
    this.client = client
    this.key = `basket:${userId}`
  }

  async add (productId) {
    return this.client.hincrby(this.key, productId, 1)
  }

  async getAll () {
    return this.client.hgetall(this.key)
  }

  async remove (productId) {
    return this.client.hdel(this.key, productId)
  }

  async empty () {
    return this.client.del(this.key)
  }

  async getItemCount (productId) {
    const count = await this.client.hget(this.key, productId)
    return count ? parseInt(count) : 0
  }
}

export default BasketService;