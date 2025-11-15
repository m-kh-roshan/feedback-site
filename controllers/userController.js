const Joi = require("joi");
const bcrypt = require("bcrypt")
const crypto = require('crypto')
const jwt = require("jsonwebtoken")
const userService = require("../services/userServices");
const { generateTokens } = require("../utilities/tokenUtiles");
const tokenService = require("../services/tokenServices");
const AppError = require('../utilities/appError')
const emailConfig = require('../utilities/emailConfig')

const insert = async (req, res, next) => {
  try {
    const { password, confirm_password, email } = req.body
    console.log('password:', password, 'confirm_password:', confirm_password)
    if (password != confirm_password) return next(new AppError('Password confirmation does not match.', 400, 'PASSWORD_MISMATCH'))
      
    const userByEmail = await userService.findbyEmail(email)
    if(userByEmail) return next(new AppError('This email is already registered..', 400, 'EMAIL_EXISTS'))

    const hashed_password = await bcrypt.hash(password, 10)
    const resultInsertUser = await userService.insertUser(email, hashed_password)

    const data = {
      email_token: crypto.randomBytes(32).toString("hex"),
      email_token_expire: new Date(Date.now() + 60 * 60 * 1000)
    }
    const updateUserEmailToken = await userService.update(resultInsertUser.id,  data)

    const emailResponse = await emailConfig.sendMail(email, 'Confirm Email', 'confirm email please', emailConfig.confirmEmailBody(data.email_token, resultInsertUser.username), next)
    console.log(emailResponse)
    return res.status(201).json({
      code: "USER_CREATED",
      message: "Your account has been created successfully."
    });
  } catch (error) {
    return next(error)
  }
}

const emailVerify = async (req, res, next) => {
  try {
    const {token} = req.query
    const user = await userService.findByTokens(token)

    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))

    if(user.email_verified) return next(new AppError('User is already verified', 400, 'ALREADY_VERIFIED'))
    
    const data = {
      email_verified: true
    }
    const resultUpdateUser = userService.update(user.id, data)
    return res.status(200).json({
      code: "EMAIL_VERIFIED",
      message: "Your email has been verified successfully."
    });
  } catch (error) {
    return next(error)
  }
}

const resendEmailVerify = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await userService.findbyEmail(email)
    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))
    if(user.email_verified) return next(new AppError('User is already verified', 400, 'ALREADY_VERIFIED'))

    const data = {
      email_token: crypto.randomBytes(32).toString("hex"),
      email_token_expire: new Date(Date.now() + 60 * 60 * 1000)
    }
    const updateUserEmailToken = await userService.update(user.id,  data)

    const emailResponse = await emailConfig.sendMail(email, 'Confirm Email', 'confirm email please', emailConfig.confirmEmailBody(data.email_token, user.username), next)
    return res.status(200).json({
      code: "EMAIL_SENT",
      message: "Email confirming sent successfully"
    });

  } catch (error) {
    return next(error)
  }
}

const login = async(req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userService.findbyEmail(email)

    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'))

    const tokens = await generateTokens(user)

    res.status(200).json({
      code: 'LOGIN_SUCCESS',
      message: 'Logged in successfully',
      data: tokens
    }) 
  } catch (error) {
    return next(error)
  }
}

const token = async(req, res, next) => {
  try {
    const { refreshToken } = req.body
    if(!refreshToken) return next(new AppError('No token provided', 401, 'NO_TOKEN'))

    const token = await tokenService.findTokenByToken(refreshToken)
    if(!token) return next(new AppError('Invalid refresh token', 403, 'INVALID_REFRESH_TOKEN'))
    
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await userService.findbyEmail(payload.email)
    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))
        
    const tokens = await generateTokens(user)
    const deleteToken = await tokenService.destroyByToken(refreshToken)

    res.status(200).json({
      code: 'TOKENS_ISSUED',
      message: 'New access and refresh tokens issued successfully',
      data: tokens
    });
  } catch (error) {
      return next(error)
  }
}

const profile = async (req, res, next) => {
  try {
    const user = await userService.findbyEmail(req.user.email)
    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))
  
    return res.status(200).json({
      code: 'PROFILE_FETCHED',
      message: 'User profile retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    return next(error)
  }
}

const resetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await userService.findbyEmail(email)
    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))
    
    const data = {
      reset_password_token: crypto.randomBytes(32).toString("hex"),
      reset_password_token_expire: new Date(Date.now() + 60 * 60 * 1000)
    }
    const updateUserResetPasswordToken = await userService.update(user.id,  data)

    const emailResponse = await emailConfig.sendMail(email, 'Reset Password', 'Reset password by click on this link', emailConfig.resetPasswordBody(data.reset_password_token, user.username), next)
    return res.status(200).json({
      code: "EMAIL_SENT",
      message: "Reset password email sent successfully"
    });
  } catch (error) {
    return next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { password, confirm_password, token } = req.body

    const user = await userService.findByTokens(token)
    if(!user) return next(new AppError('User not found', 400, 'NOT_FOUND'))

    if (password != confirm_password) return next(new AppError('Password confirmation does not match.', 400, 'PASSWORD_MISMATCH'))
    
    const hashed_password = await bcrypt.hash(password, 10)

    const data = {
      password: hashed_password,
      reset_password_token_expire: Date.now()
    }
    const resultResetPassword = await userService.update(user.id, data)
    return res.status(200).json({
      code: "PASSWORD_RESET",
      message: "Password reset successfully"
    });
  } catch (error) {
    return next(error)
  }
}


const logOut = async(req, res, next) => {
  try {
    const { refreshToken } = req.body
    if(!refreshToken) return next(new AppError('No token provided', 401, 'NO_TOKEN'))

    const deleteToken = await tokenService.destroyByToken(refreshToken)

    res.status(200).json({
      code: 'LOGOUT_SUCCESS',
      message: 'You have logged out successfully'
    });
    
  } catch (error) {
    return next(error)
  }
}

module.exports = {insert, emailVerify, login, profile, token, logOut, resendEmailVerify, resetPassword, resetPasswordEmail}