import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../config'
import crypto from 'crypto'

const userSchema = Schema({
  firstName: {
    type: String,
    trim: true,
    minlength: 3
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 4
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    index: { unique: true }
  },
  password: {
    type: String,
    minlength: 6,
    triem: true
  },
  role: {
    type: String,
    enum: config.userRoles,
    default: 'user'
  },
  status: {
    type: String,
    enum: config.userStatuses,
    default: 'new'
  },
  verificationToken: {
    type: String,
    index: true,
    required: true,
    default: crypto.randomBytes(16).toString('hex')
  },

  age: {
    type: Number,
  },

  orders: [{
    type: Number,
    ref: 'Order'
  }]

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

userSchema.pre(
  'save',
  async function preSave (next) {
    const user = this
    if (user.isModified('password')) {
      try {
        const hash = await bcrypt.hash(user.password, 12)
        user.password = hash
        return next()
      } catch (e) {
        next(e)
      }
    }
  }
)

userSchema.methods.comparePassword = async function comparePassword (
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.entitize = function () {
  const args = Array.from(arguments)
  const res = this.toObject({ virtuals: true })
  delete res.__v
  res.id = res._id
  delete res._id
  for (const item of args) {
    delete res[item]
  }
  return res
}

const UserModel = model('User', userSchema)

export default UserModel
