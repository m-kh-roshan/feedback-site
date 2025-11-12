const Joi = require("joi");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userService = require("../services/userServices");
const { generateTokens } = require("../utilities/tokenUtiles");
const tokenService = require("../services/tokenServices");
const AppError = require('../utilities/appError')

const insert = async (req, res, next) => {
  try {
    const { password, confirm_password, email } = req.body
    if (password != confirm_password) return next(new AppError('Password confirmation does not match.', 400, 'PASSWORD_MISMATCH'))
      
    const userByEmail = await userService.findbyEmail(email)
    if(userByEmail) return next(new AppError('This email is already registered..', 400, 'EMAIL_EXISTS'))

    const hashed_password = await bcrypt.hash(password, 10)
    const resultInsertUser = await userService.insertUser(email, hashed_password)
    return res.status(201).json({
      code: "USER_CREATED",
      message: "Your account has been created successfully."
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

module.exports = {insert, login, profile, token, logOut}