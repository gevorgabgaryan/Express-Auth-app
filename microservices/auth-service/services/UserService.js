import UserModel from '../models/UserModel'

class UserService {
  static async findByEmail (email) {
    return await UserModel.findOne({ email })
  }

  static async findById (id) {
    return await UserModel.findById(id)
  }

  static async addUser (email, password, firstName, lastName) {
    const user = new UserModel({
      email,
      password,
      firstName,
      lastName
    })
    return await user.save()
  }
}

export default UserService;