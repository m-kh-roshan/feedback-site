const Joi = require("joi");
const bcrypt = require("bcrypt")
const userService = require("../services/userServices");
const { generateTokens } = require("../utilities/tokenUtiles");

const insert = async (req, res) => {
    const schema = Joi.object({
        password : Joi.string().min(8).max(30).required(),
        confirm_password : Joi.string().min(8).max(30).required(),
        email: Joi.string().email().required()
    })

    const validateResult = schema.validate(req.body)
    if(validateResult.error) 
        return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: validateResult.error.details[0].message,
    });
    if(req.body.password != req.body.confirm_password)
        return res.status(400).json({
      code: "PASSWORD_MISMATCH",
      message: "Password confirmation does not match.",
    });

    const userByEmail = await userService.findbyEmail(req.body.email)
    if(userByEmail)
        return res.status(409).json({
      code: "EMAIL_EXISTS",
      message: "This email is already registered.",
    });

    try {
      const hashed_password = await bcrypt.hash(req.body.password, 10)
      const resultInsertUser = await userService.insertUser(req.body.email, hashed_password)
      return res.status(201).json({
        code: "USER_CREATED",
        message: "Your account has been created successfully.",
      });
    } catch (error) {
       return res.status(500).json({
         code: "USER_CREATION_FAILED",
         message: `Failed to create user due ${error}.`,
       });
    }
}

const login = async(req, res) => {
    const user = await userService.findbyEmail(req.body.email)
    if(!user)
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "User not found"
        })
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword)
        return res.status(401).json({message: "Invalid credentials"})

    const tokens = await generateTokens(user)

    res.json(tokens)
}

const profile = async (req, res) => {
  const user = await userService.findbyEmail(req.user.email)

  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "User not found"
    })
  }

  return res.json(user)
}

module.exports = {insert, login, profile}