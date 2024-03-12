import Joi from 'joi';

// (?=.*\d): At least one digit (0-9) is required.
// (?=.*[a-z]): At least one lowercase letter (a-z) is required.
// (?=.*[A-Z]): At least one uppercase letter (A-Z) is required.
// [-!@#$%^&*()_+|~={}:";'<>?,./0-9a-zA-Z]`: The password can consist of only the
export const passwordPattern =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/0-9a-zA-Z]{6,}$/

export const registerBodySchema = Joi.object({
  firstName: Joi.string().min(3).max(200),
  lastName: Joi.string().min(3).max(200),
  email: Joi.string().email().required().max(40),
  password: Joi.string()
    .regex(RegExp(passwordPattern))
    .required()
    .min(6)
    .max(20)
})

export const loginBodySchema = Joi.object({
  email: Joi.string().email().required().max(40),
  password: Joi.string()
    .regex(RegExp(passwordPattern))
    .required()
    .min(6)
    .max(20)
})